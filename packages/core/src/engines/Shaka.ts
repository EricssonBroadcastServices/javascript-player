// SPDX-FileCopyrightText: 2024 Red Bee Media Ltd <https://www.redbeemedia.com/>
//
// SPDX-License-Identifier: MIT

import merge from "lodash.merge";
import shaka from "shaka-player";

import {
  DRMType,
  KeySystem,
  PlaybackState,
  QualityLevel,
  Track,
  debounce,
  getLabel,
  patchShakaSSAIManifest,
} from "@ericssonbroadcastservices/js-player-shared";

import { InstanceSettingsInterface } from "../utils/interfaces";
import {
  AbstractBaseEngine,
  getAudioKind,
  getDashAudioKind,
  getDashTextKind,
  getQualityLevelName,
  getTextKind,
} from "./AbstractBaseEngine";
import {
  ShakaLive,
  Shaka as defaultConfiguration,
} from "./defaultConfigurations";
import {
  EngineEvents,
  ILicense,
  MetadataEngineEvent,
  TAudioKind,
  TLoadParameters,
  TTextKind,
} from "./interfaces";
import {
  TRestrictions,
  getResolutionAndBitrateRestrictions,
} from "./utils/restrictions";
import { convertError } from "./utils/ShakaErrors";

// Shaka unfortunately doesn't export this type
// https://shaka-player-demo.appspot.com/docs/api/shaka.Player.html#.event:ErrorEvent
type ShakaErrorEvent = Event & { detail: shaka.util.Error; type: string };

// Comment out the below code to enable debugging, remember to remove the default shaka import.
// import shaka from "shaka-player/dist/shaka-player.compiled.debug";
// shaka.log.setLevel(shaka.log.Level.V2);

const DECODER_ERROR_MESSAGE = "DECODER_ERROR_NOT_SUPPORTED";

function createTrack(track: shaka.extern.Track): Track {
  let kind: string | undefined;
  const label = track.label || getLabel(track.language);
  if (track.type === "variant") {
    kind = getAudioKind(track.audioRoles ?? []);
  } else if (track.type === "text") {
    kind = getTextKind(track.roles);
  }
  return {
    id: `${track.language} - ${label}`,
    language: track.language,
    kind,
    label,
    raw: track,
  };
}

const HEVC_REGEX = new RegExp(/hev1|hvc1/);

/**
 * monkey patch MediaSource.isTypeSupported to disable HEVC support
 */
let hevcDisabled = false;
function disableHEVC() {
  hevcDisabled = true;
  const isTypeSupported = MediaSource.isTypeSupported;
  MediaSource.isTypeSupported = (mimeType) => {
    if (mimeType && HEVC_REGEX.test(mimeType)) {
      return false;
    }
    return isTypeSupported(mimeType);
  };
}

const MAX_RECOVERY_ATTEMPS = 1;

export class Shaka extends AbstractBaseEngine {
  readonly name = "Shaka Player";
  readonly playertechVersion = shaka.Player.version;
  private shakaPlayer: shaka.Player;

  private src?: string;
  private startTime?: number;
  private resizeObserver?: ResizeObserver;
  private utcTimeIsSet = false;

  private recoveryAttempts = 0;

  private subtitle: { language?: string; kind?: TTextKind };
  private audio: { language?: string; kind?: TAudioKind };

  constructor(
    videoElement: HTMLVideoElement,
    instanceSettings: InstanceSettingsInterface
  ) {
    super(videoElement, instanceSettings);
    shaka.polyfill.installAll();
    this.shakaPlayer = new shaka.Player();
    this.shakaPlayer.attach(videoElement);
    this.instanceSettings = instanceSettings;
    this.subtitle = { language: undefined, kind: undefined };
    this.audio = { language: undefined, kind: undefined };

    this.setupEventListeners();
  }

  protected setupEventListeners() {
    super.setupEventListeners();
    const networkEngine = this.shakaPlayer.getNetworkingEngine();
    networkEngine?.registerRequestFilter((type) => {
      if (type === shaka.net.NetworkingEngine.RequestType.LICENSE) {
        switch (this.shakaPlayer.drmInfo()?.keySystem) {
          case KeySystem.PLAYREADY:
          case KeySystem.PLAYREADY_CHROMECAST:
            this.emit(EngineEvents.DRM_UPDATE, "PLAYREADY_LICENSE_REQUEST");
            break;
          case KeySystem.WIDEVINE:
            this.emit(EngineEvents.DRM_UPDATE, "WIDEVINE_LICENSE_REQUEST");
            break;
          case KeySystem.FAIRPLAY:
            this.emit(EngineEvents.DRM_UPDATE, "FAIRPLAY_LICENSE_REQUEST");
            break;
        }
      }
    });
    networkEngine?.registerResponseFilter((type) => {
      if (type === shaka.net.NetworkingEngine.RequestType.LICENSE) {
        switch (this.shakaPlayer.drmInfo()?.keySystem) {
          case KeySystem.PLAYREADY:
          case KeySystem.PLAYREADY_CHROMECAST:
            this.emit(EngineEvents.DRM_UPDATE, "PLAYREADY_LICENSE_RESPONSE");
            break;
          case KeySystem.WIDEVINE:
            this.emit(EngineEvents.DRM_UPDATE, "WIDEVINE_LICENSE_RESPONSE");
            break;
          case KeySystem.FAIRPLAY:
            this.emit(EngineEvents.DRM_UPDATE, "FAIRPLAY_LICENSE_RESPONSE");
            break;
        }
      }
    });
    this.shakaPlayer.addEventListener("adaptation", () => {
      const activeTracks = this.shakaPlayer
        .getVariantTracks()
        .filter((track) => track.active);

      if (!activeTracks.length) {
        return;
      }

      const bitrate = activeTracks.reduce(
        (btr, track) => btr + track.bandwidth,
        0
      );
      const videoTrack = activeTracks.find((track) => track.type === "variant");

      if (videoTrack) {
        this.emit(EngineEvents.BITRATE_CHANGED, {
          bitrate,
          width: videoTrack.width ?? -1,
          height: videoTrack.height ?? -1,
        });
      }
    });

    this.shakaPlayer.addEventListener("error", ((event: ShakaErrorEvent) => {
      this.handleError(event.detail);
    }) as any);

    this.shakaPlayer.addEventListener(
      "trackschanged",
      this.onTracksChange.bind(this)
    );

    this.shakaPlayer.addEventListener("timelineregionenter", ((
      evt: Event & { detail: shaka.extern.TimelineRegionInfo }
    ) => {
      const schemeIdURIs = this.instanceSettings.initOptions?.metadataURIs;
      const metadataEvent: MetadataEngineEvent = {
        event: [],
        engineName: "Shaka Player",
        engineVersion: shaka.Player.version,
      };
      if (schemeIdURIs?.length) {
        schemeIdURIs.forEach((uri) => {
          if (uri === evt.detail.schemeIdUri) {
            metadataEvent.event = evt;
            this.emit(EngineEvents.METADATA_EVENT, metadataEvent);
          }
        });
      } else if (schemeIdURIs) {
        metadataEvent.event = evt;
        this.emit(EngineEvents.METADATA_EVENT, metadataEvent);
      }
    }) as any);
  }

  private setupStartGapDetection() {
    // workaround for shaka not detecting gaps in the beginning
    const onProgress = () => {
      if (this.getPlaybackState() !== PlaybackState.LOADING) {
        return;
      }
      const buffered = this.videoElement.buffered;
      if (buffered.length) {
        const start = buffered.start(0);
        const end = buffered.end(0);
        if (start > 0 && end - start > 0) {
          this.removeVideoEventListener("progress", onProgress);
          // we have something buffered and there is a gap in the beginning, seek to start of buffer to avoid getting stuck
          this.videoElement.currentTime = start;
        }
      }
    };
    this.addVideoEventListener("progress", onProgress);
  }

  protected convertToUTCTime(time: number): number {
    const presentationStartTime =
      this.shakaPlayer.getPresentationStartTimeAsDate();
    if (this.isLive() && presentationStartTime) {
      time += presentationStartTime.getTime() / 1000;
      return time * 1000;
    }
    if (this.utcTimeIsSet) {
      return super.convertToUTCTime(time);
    }
    return -1;
  }

  private async _load({
    src,
    license,
    startTime,
    audio,
    subtitle,
  }: TLoadParameters) {
    this.startTime = startTime;
    const customConfiguration =
      this.instanceSettings.initOptions.customShakaConfiguration || {};
    const configuration = merge({}, defaultConfiguration, customConfiguration);
    if (this.instanceSettings.mediaInfo?.isLive) {
      merge(configuration, ShakaLive);
    }

    this.src = src;
    this.setLicense(this.instanceSettings.supportedKeySystem, license);
    this.shakaPlayer.configure(configuration);
    this.shakaPlayer.configure(
      "manifest.dash.manifestPreprocessor",
      patchShakaSSAIManifest(this.instanceSettings.playResponse?.ads?.clips)
    );

    this.setResolutionAndBitrateRestrictions(
      await getResolutionAndBitrateRestrictions(
        this.instanceSettings.playResponse?.contractRestrictions
      )
    );

    this.setContentSpecificConfiguration();
    this.setContextSpecificConfiguration();

    this.setPlaybackState(PlaybackState.LOADING);

    if (audio?.language) {
      this.audio = {
        language: audio.language,
        kind: audio.kind,
      };
      this.shakaPlayer.configure("preferredAudioLanguage", audio.language);
      if (this.audio?.kind) {
        this.shakaPlayer.configure(
          "preferredVariantRole",
          getDashAudioKind(this.audio.kind)
        );
      }
    }
    if (subtitle?.language) {
      this.subtitle = {
        language: subtitle.language,
        kind: subtitle.kind,
      };
      this.shakaPlayer.configure("preferredTextLanguage", subtitle.language);
      if (this.subtitle?.kind) {
        this.shakaPlayer.configure(
          "preferredTextRole",
          getDashTextKind(this.subtitle.kind)
        );
      }
    }

    if (startTime === undefined || startTime === 0) {
      this.setupStartGapDetection();
    }

    this.shakaPlayer
      .load(src, startTime)
      .then(() => {
        super.load({ src, license, startTime });
      })
      .catch((err) => {
        this.handleError(err);
      });
  }

  load(parameters: TLoadParameters): void {
    // load doesn't return a promise but since we want to use async/await we call a private method
    this._load(parameters);
  }

  setPreferredLanguages() {
    // no-op, done in load
  }

  stop() {
    if (this.shakaPlayer.getLoadMode() !== shaka.Player.LoadMode.DESTROYED) {
      this.shakaPlayer.unload();
    }
    super.stop();
  }

  isLive() {
    return this.shakaPlayer.isLive();
  }

  addSubtitleEvents() {
    this.shakaPlayer.addEventListener(
      "textchanged",
      this.onTextTracksChange.bind(this)
    );
  }

  addAudioTrackEvents() {
    this.shakaPlayer.addEventListener(
      "variantchanged",
      this.onAudioTrackChange.bind(this)
    );
  }

  getSeekable() {
    const { start, end } = this.shakaPlayer.seekRange();
    return { start, end };
  }

  getUTCSeekable() {
    const seekable = this.shakaPlayer.seekRange();
    return {
      start: this.convertToUTCTime(seekable.start),
      end: this.convertToUTCTime(seekable.end),
    };
  }

  setLicense(supportedKeySystem?: DRMType, license?: ILicense) {
    if (license) {
      if (supportedKeySystem === KeySystem.WIDEVINE) {
        this.setWidevine(license);
      } else if (supportedKeySystem === KeySystem.PLAYREADY) {
        this.setPlayready(license);
      }
    }
  }

  setPlayready(license: ILicense) {
    const playreadyLicenseObject = license[KeySystem.PLAYREADY];
    if (playreadyLicenseObject) {
      this.shakaPlayer.configure({
        drm: {
          servers: {
            [KeySystem.PLAYREADY]: playreadyLicenseObject.licenseServerUrl,
          },
        },
      });
    }
  }

  setWidevine(license: ILicense) {
    const widevineLicenseObject = license[KeySystem.WIDEVINE];
    if (widevineLicenseObject) {
      this.shakaPlayer.configure({
        drm: {
          servers: {
            [KeySystem.WIDEVINE]: widevineLicenseObject.licenseServerUrl,
          },
          advanced: {
            [KeySystem.WIDEVINE]: {
              videoRobustness: "SW_SECURE_CRYPTO",
              audioRobustness: "SW_SECURE_CRYPTO",
            },
          },
        },
      });
    }
  }

  setResolutionAndBitrateRestrictions({
    minBitrate,
    maxBitrate,
    maxResHeight,
  }: TRestrictions) {
    if (!minBitrate && !maxBitrate && !maxResHeight) return;
    this.shakaPlayer.configure({
      restrictions: {
        ...(minBitrate && { minBandwidth: minBitrate }),
        ...(maxBitrate && { maxBandwidth: maxBitrate }),
        ...(maxResHeight && { maxHeight: maxResHeight }),
      },
    });
  }

  setContentSpecificConfiguration() {
    if (!this.instanceSettings.mediaInfo || !this.instanceSettings.formats)
      return;
    const isLive = this.instanceSettings.mediaInfo.isLive;
    if (isLive) {
      const currentPlaybackObject = this.instanceSettings.formats.find(
        (f) => f.mediaLocator === this.src
      );
      if (currentPlaybackObject?.liveDelay) {
        this.shakaPlayer.configure({
          manifest: {
            defaultPresentationDelay: currentPlaybackObject.liveDelay / 1000,
          },
        });
      }
    }
  }

  setContextSpecificConfiguration() {
    if (!window.ResizeObserver) return;
    this.resizeObserver = new ResizeObserver(
      debounce(this.capLevelToPlayerSize.bind(this))
    );
    this.resizeObserver.observe(this.videoElement);
  }

  capLevelToPlayerSize() {
    const caps = [
      {
        min: 0,
        max: 1280,
        value: 1280,
      },
      {
        min: 1281,
        max: 1920,
        value: 1920,
      },
    ];

    if (
      !this.shakaPlayer ||
      this.shakaPlayer.getLoadMode() === shaka.Player.LoadMode.DESTROYED
    ) {
      return;
    }
    const heightRestriction =
      this.instanceSettings.playResponse?.contractRestrictions?.maxResHeight;
    const maxWidthSet =
      this.shakaPlayer.getConfiguration()?.abr?.restrictions?.maxWidth;
    const videoElementWidth = this.videoElement.clientWidth;
    let maxWidthToSet =
      caps.find(
        (cap) => cap.min <= videoElementWidth && cap.max >= videoElementWidth
      )?.value || Infinity;

    if (maxWidthToSet === maxWidthSet) return;
    if (heightRestriction) {
      const levels = this.getQualityLevels().sort((a, b) => b.width - a.width);
      const restrictedMaxLevel = levels.find(
        (level) =>
          level.width <= maxWidthToSet && level.height <= heightRestriction
      );
      if (restrictedMaxLevel) {
        maxWidthToSet = restrictedMaxLevel.width;
      }
    }

    this.shakaPlayer.configure("abr.restrictions.maxWidth", maxWidthToSet);
  }

  setQualityLevel(level: QualityLevel): void {
    const track = this.shakaPlayer
      .getVariantTracks()
      .find((track) => track.id === level.id);
    if (track) {
      this.shakaPlayer.configure("abr.enabled", false);
      this.shakaPlayer.selectVariantTrack(track, true, 10);
      /**
       * Shaka won't trigger adaption change events when manually setting the level, and disabling the abr engine
       * https://shaka-player-demo.appspot.com/docs/api/shaka.Player.html#.event:AdaptationEvent
       * Therefore we trigger a manual one.
       */
      this.emit(EngineEvents.BITRATE_CHANGED, {
        bitrate: level.bandwidth,
        width: level.width,
        height: level.height,
      });
    } else {
      this.shakaPlayer.configure("abr.enabled", true);
    }
  }

  getQualityLevel(): QualityLevel {
    const activeTrack = this.shakaPlayer
      .getVariantTracks()
      .find((track) => track.active);

    if (!activeTrack) {
      return super.getQualityLevel();
    }
    return {
      id: activeTrack.id,
      bandwidth: activeTrack.bandwidth,
      width: activeTrack.width ?? -1,
      height: activeTrack.height ?? -1,
      framerate: activeTrack.frameRate ?? undefined,
    };
  }

  getQualityLevels(): QualityLevel[] {
    if (this.instanceSettings.loadOptions?.audioOnly) return [];
    if (
      !this.shakaPlayer.getVariantTracks() ||
      !Array.isArray(this.shakaPlayer.getVariantTracks())
    )
      return [];

    const activeTrack = this.shakaPlayer
      .getVariantTracks()
      .find((track) => track.active);

    const qualityLevels = this.shakaPlayer
      .getVariantTracks()
      .filter(
        (track) =>
          track.audioId === activeTrack?.audioId &&
          track.audioBandwidth === activeTrack?.audioBandwidth
      )
      .map((track) => {
        const qualityLevel: QualityLevel = {
          id: track.id,
          bandwidth: track.bandwidth,
          width: track.width ?? -1,
          height: track.height ?? -1,
          framerate: track.frameRate ?? undefined,
        };
        qualityLevel.name = getQualityLevelName(qualityLevel);
        return qualityLevel;
      });
    return [...super.getQualityLevels(), ...qualityLevels];
  }

  private setInternalSubtitle(subtitle: {
    language: string | undefined;
    kind: TTextKind | undefined;
  }) {
    this.subtitle = subtitle;
  }

  private setInternalAudio(audio: Track) {
    this.audio.language = audio.language;
    this.audio.kind = audio.kind as TAudioKind;
  }

  private toggleSubtitles(enabled: boolean) {
    // Shaka reuses the same text track for all languages and it sets the "mode" according to this behavior:
    // * "showing": if the visibility is true (`setTextTrackVisibility(true)`)
    // * "hidden": if the visibility is false but alwaysStreamText is true
    // * "disabled": if both are false
    //
    // We want to switch between fully disabled and hidden (text track and cue events enabled for our custom rendering).
    // So visibility should always be false and alwaysStreamText must be true when subs are enabled
    this.shakaPlayer.configure("streaming.alwaysStreamText", enabled);
    this.shakaPlayer.setTextTrackVisibility(false);
  }

  setSubtitleTrack(track?: Track) {
    const internalTrack = this.shakaPlayer
      .getTextTracks()
      .find((t) => track && createTrack(t)?.id === track.id);

    this.toggleSubtitles(!!internalTrack);

    if (track) {
      if (!internalTrack) {
        // TODO: inform the consumer that the selected track could not be found?
        return;
      }

      this.setInternalSubtitle({
        language: internalTrack.language,
        kind: internalTrack.roles && getTextKind(internalTrack.roles),
      });

      if (!internalTrack.active) {
        this.shakaPlayer.selectTextTrack(internalTrack);
      }
    } else {
      const forcedSubtitle = this.shakaPlayer
        .getTextTracks()
        .find((track) => track.roles.includes("forced-subtitle"));

      if (forcedSubtitle) {
        this.setInternalSubtitle({
          language: forcedSubtitle.language,
          kind: forcedSubtitle.roles && getTextKind(forcedSubtitle.roles),
        });

        if (!forcedSubtitle.active) {
          this.shakaPlayer.selectTextTrack(forcedSubtitle);
        }
      } else {
        // shaka can't disable text tracks, we set an internal variable to see if text tracks
        // are enabled
        this.setInternalSubtitle({
          language: undefined,
          kind: undefined,
        });
        this.onTextTracksChange();
      }
    }
  }

  getSubtitleTrack() {
    const shakaTrack = this.shakaPlayer
      .getTextTracks()
      .find((track) => track.active);

    if (!shakaTrack) {
      return undefined;
    }

    const track = createTrack(shakaTrack);
    if (
      this.subtitle.language === track.language &&
      this.subtitle.kind === track.kind
    ) {
      return track;
    }
    if (this.subtitle.kind === "forced") {
      const shakaForcedTrack = this.shakaPlayer
        .getTextTracks()
        .find((track) => track.roles.includes("forced-subtitle"));

      const forcedTrack = !!shakaForcedTrack && createTrack(shakaForcedTrack);
      return forcedTrack || undefined;
    }
    return undefined;
  }

  getSubtitleTracks() {
    return this.filterVisibleSubtitleTracks(
      this.shakaPlayer
        .getTextTracks()
        .map((track) => createTrack(track))
        .filter(
          (track, index, array) =>
            array.findIndex(
              (compTrack) =>
                track.language === compTrack.language &&
                track.label === compTrack.label &&
                track.kind === compTrack.kind
            ) === index
        )
    );
  }

  getSubtitleTracksWithForced() {
    return this.shakaPlayer
      .getTextTracks()
      .map((track) => createTrack(track))
      .filter(
        (track, index, array) =>
          array.findIndex(
            (compTrack) =>
              track.language === compTrack.language &&
              track.label === compTrack.label &&
              track.kind === compTrack.kind
          ) === index
      );
  }

  setAudioTrack(track: Track) {
    if (track.raw?.label) {
      this.shakaPlayer.selectVariantsByLabel(track.raw.label);
    } else {
      // Changing audio tracks while abr manager is enabled will likely result in the selected track being overridden.
      // To not cause it to be overridden we disabling abr before switching audio tracks.
      this.shakaPlayer.configure("abr.enabled", false);
      this.shakaPlayer.selectAudioLanguage(
        track.language,
        getDashAudioKind(track.kind as TAudioKind)
      );
      this.shakaPlayer.configure("abr.enabled", true);
    }
    this.setInternalAudio(track);
    this.onAudioTrackChange();
  }

  getAudioTrack() {
    const track = this.shakaPlayer
      .getVariantTracks()
      .find((track) => track.active);
    if (track) {
      return createTrack(track);
    }
  }

  getAudioTracks() {
    return this.shakaPlayer
      .getVariantTracks()
      .map((track) => createTrack(track))
      .filter(
        (track, index, array) =>
          array.findIndex(
            (compTrack) =>
              track.language === compTrack.language &&
              track.label === compTrack.label &&
              track.kind === compTrack.kind
          ) === index
      );
  }

  onTracksChange() {
    const forcedSubtitle = this.getSubtitleTracksWithForced().find(
      (subtitle) => subtitle.kind === "forced"
    );

    let track: Track | undefined;
    if (this.subtitle.language) {
      // multi-period dash won't set the correct subtitle language
      // if subtitles aren't part of the first period.
      track = this.getSubtitleTracks().find(
        (track) =>
          track.language === this.subtitle.language &&
          (!this.subtitle.kind || this.subtitle.kind === track.kind)
      );
      if (!track && !!forcedSubtitle) {
        this.setSubtitleTrack(forcedSubtitle);
      }
      if (track) {
        this.setSubtitleTrack(track);
      }
    }
    if (!this.subtitle.language && !!forcedSubtitle) {
      this.setSubtitleTrack(forcedSubtitle);
    }
    super.onTracksChange();
  }

  onError() {
    // Errors are handled by Shaka, ignore native errors
  }

  handleError(error: shaka.util.Error) {
    const videoCodec = this.shakaPlayer
      .getVariantTracks()
      .find((variant) => variant.active)?.videoCodec;
    if (
      videoCodec &&
      error?.data?.[2]?.includes(DECODER_ERROR_MESSAGE) &&
      HEVC_REGEX.test(videoCodec) &&
      !hevcDisabled
    ) {
      disableHEVC();
      this.shakaPlayer.unload().then(() => {
        if (this.src) {
          return this.load({
            src: this.src,
            license: undefined,
            startTime: this.startTime,
            audio: this.audio,
            subtitle: this.subtitle,
          });
        }
      });
    } else {
      const { error: playerError, fatal } = convertError(error);
      // If playerError isn't fatal then we have an error that we might be able to recover from
      if (!fatal && MAX_RECOVERY_ATTEMPS > this.recoveryAttempts) {
        this.recoveryAttempts += 1;
        const retrying = this.shakaPlayer.retryStreaming();
        if (retrying) return;
      }
      this.emit(EngineEvents.ERROR, playerError);
    }
  }

  destroy() {
    if (this.resizeObserver) {
      this.resizeObserver.disconnect();
    }
    this.shakaPlayer.destroy();
    super.destroy();
  }
}
