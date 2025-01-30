// SPDX-FileCopyrightText: 2024 Red Bee Media Ltd <https://www.redbeemedia.com/>
//
// SPDX-License-Identifier: MIT

import dashjs, {
  MediaInfo,
  MediaPlayer,
  MediaPlayerClass,
  MediaPlayerSettingClass,
  MediaType,
  ProtectionDataSet,
  Representation,
  TrackChangeRenderedEvent,
} from "dashjs";
import { MssHandler } from "dashjs/dist/dash.mss.min";
import merge from "lodash.merge";

import {
  AUTO_QUALITY_LEVEL_DEFINITION,
  DRMType,
  DashJsPlayerError,
  ErrorTypes,
  KeySystem,
  PlaybackState,
  QualityLevel,
  Track,
  getLabel,
} from "@ericssonbroadcastservices/js-player-shared";

import { getBrowserVersion, isLGTV } from "../device/common";
import { getSupportedDrm } from "../utils/helpers";
import { InstanceSettingsInterface } from "../utils/interfaces";
import { getPreferences } from "../utils/preferences";
import {
  AbstractBaseEngine,
  getAudioKind,
  getDashAudioKind,
  getDashTextKind,
  getQualityLevelName,
  getTextKind,
} from "./AbstractBaseEngine";
import { DashJsDefaults, DashJsLowLatency } from "./defaultConfigurations";
import {
  EngineEvents,
  ILicense,
  TAudioKind,
  TLoadParameters,
} from "./interfaces";
import { patchMediaSourceChrome53 } from "./utils/dashJsPatches";

// Set MssHandler to the global dashjs object to allow for SmoothStreaming playback
(dashjs as any).MssHandler = MssHandler;

const HEVC_REGEX = new RegExp(/hev1|hvc1/);

function getErrorTypeFromCode(code: number): ErrorTypes {
  const category =
    Object.entries(MediaPlayer.errors).find(
      ([, value]) => value === code
    )?.[0] || "";
  if (category.includes("REQUEST")) return ErrorTypes.NETWORK;
  if (category.includes("CAPABILITY")) return ErrorTypes.CODEC;
  if (category.includes("KEY")) return ErrorTypes.DRM;
  if (category.includes("MANIFEST")) return ErrorTypes.MANIFEST;
  if (category.includes("FRAGMENT") || category.includes("SEGMENT")) {
    return ErrorTypes.SEGMENT;
  }
  if (category.includes("MEDIA")) return ErrorTypes.MEDIA;
  return ErrorTypes.OTHER;
}

function createTrack(track: MediaInfo): Track {
  let kind: string | undefined;
  if (track.type === "audio") {
    kind = getAudioKind(track.roles ?? []);
  } else if (track.type === "text") {
    kind = getTextKind(track.roles ?? []);
  }
  return {
    id: track.id!, // number although dash.js typings says string...
    language: track.lang || "",
    // @ts-ignore, invalid typings from dashjs
    label: track.labels[0]?.text || getLabel(track.lang),
    kind,
    raw: track,
  };
}

// Custom capabilities filter to filter out `hvc1.*.*.*.B0` codecs on LG as well as high framerates.
export function getCapabilitiesFilter(
  isHEVCDrmSupported?: boolean
): (representation: Partial<Representation>) => boolean {
  return (representation: Partial<Representation>) => {
    if (isLGTV() && getBrowserVersion() === 38) {
      if (
        (representation.frameRate && representation.frameRate > 30) ||
        (representation.codecs &&
          HEVC_REGEX.test(representation.codecs) &&
          representation.codecs.includes(".B0"))
      ) {
        return false;
      }
    }

    if (
      isHEVCDrmSupported === false &&
      representation.codecs &&
      HEVC_REGEX.test(representation.codecs)
    ) {
      return false;
    }

    return true;
  };
}

// Sort priority of video tracks so that HEVC is first ( if supported )
function initialTrackSelection(tracks: MediaInfo[]) {
  const sorted = tracks.sort((a, b) => {
    if (
      a.codec &&
      b.codec &&
      HEVC_REGEX.test(a.codec) &&
      !HEVC_REGEX.test(b.codec)
    ) {
      return -1;
    }
    return 0;
  });
  return sorted;
}

export class DashJs extends AbstractBaseEngine {
  readonly name = "Dashjs";
  readonly playertechVersion: string = "";
  private mediaPlayer: MediaPlayerClass;
  private audioSettings: { language?: string; kind?: TAudioKind } = {};

  private src?: string;
  private keySystem?: DRMType;

  constructor(
    videoElement: HTMLVideoElement,
    instanceSettings: InstanceSettingsInterface
  ) {
    super(videoElement, instanceSettings);

    patchMediaSourceChrome53();
    this.mediaPlayer = MediaPlayer().create();
    this.playertechVersion = this.mediaPlayer.getVersion();
    this.mediaPlayer.initialize();
    this.mediaPlayer.attachView(videoElement);

    // autoplay is handled on our side to guarantee a proper eventflow
    this.mediaPlayer.setAutoPlay(false);

    this.mediaPlayer.setCustomInitialTrackSelectionFunction(
      initialTrackSelection
    );

    this.setupEventListeners();
  }

  protected setupEventListeners() {
    super.setupEventListeners();
    this.mediaPlayer.on(MediaPlayer.events.KEY_STATUSES_CHANGED, () => {
      switch (this.keySystem) {
        case KeySystem.PLAYREADY:
          this.emit(EngineEvents.DRM_UPDATE, "PLAYREADY_LICENSE_REQUEST");
          this.emit(EngineEvents.DRM_UPDATE, "PLAYREADY_LICENSE_RESPONSE");
          break;
        case KeySystem.WIDEVINE:
          this.emit(EngineEvents.DRM_UPDATE, "WIDEVINE_LICENSE_REQUEST");
          this.emit(EngineEvents.DRM_UPDATE, "WIDEVINE_LICENSE_RESPONSE");
          break;
      }
    });

    this.mediaPlayer.on(MediaPlayer.events.KEY_ERROR, () => {
      switch (this.keySystem) {
        case KeySystem.PLAYREADY:
          this.emit(EngineEvents.DRM_UPDATE, "PLAYREADY_LICENSE_ERROR");
          break;
        case KeySystem.WIDEVINE:
          this.emit(EngineEvents.DRM_UPDATE, "WIDEVINE_LICENSE_ERROR");
          break;
      }
    });

    this.mediaPlayer.on(MediaPlayer.events.QUALITY_CHANGE_RENDERED, (data) => {
      if (data.mediaType !== "video") return;
      const level = data.newQuality;
      const bitrates = this.mediaPlayer.getBitrateInfoListFor("video");
      const newLevel = bitrates[level];

      if (newLevel) {
        this.emit(EngineEvents.BITRATE_CHANGED, {
          bitrate: newLevel.bitrate,
          width: newLevel.width,
          height: newLevel.height,
        });
      }
    });

    this.mediaPlayer.on(MediaPlayer.events.TRACK_CHANGE_RENDERED, (_event) => {
      const event = _event as TrackChangeRenderedEvent; // missing dash.js type
      switch (event.mediaType) {
        case "audio":
          this.onAudioTrackChange();
          break;
        case "text":
          this.setSubtitleTrack(this.getInitialSubtitleTrack(), false);
          break;
      }
    });

    const schemeIdURIs = this.instanceSettings.initOptions?.metadataURIs ?? [];
    schemeIdURIs.forEach((uri) => {
      this.mediaPlayer.on(uri, (event) => {
        this.emit(EngineEvents.METADATA_EVENT, {
          event,
          engineName: this.name,
          engineVersion: this.playertechVersion,
        });
      });
    });

    this.mediaPlayer.on(
      MediaPlayer.events.ERROR,
      this.onDashJsError.bind(this)
    );
    this.mediaPlayer.on(
      MediaPlayer.events.PLAYBACK_ERROR,
      this.onDashJsError.bind(this)
    );
    this.mediaPlayer.on(
      MediaPlayer.events.KEY_ERROR,
      this.onDashJsError.bind(this)
    );

    this.mediaPlayer.on(MediaPlayer.events.PERIOD_SWITCH_COMPLETED, () => {
      // Workaround for https://github.com/Dash-Industry-Forum/dash.js/issues/3804
      const track = this.mediaPlayer
        .getTracksFor("audio")
        .find(
          (t) =>
            t.lang === this.audioSettings.language &&
            getAudioKind(t.roles || []) === this.audioSettings.kind
        );
      if (track && track !== this.getCurrentTrackFor("audio")) {
        this.mediaPlayer.setCurrentTrack(track);
      }
      // force a textTrack change when period changes. Dash.js will force set
      // the used textTrack to "showing" we need it "hidden"
      this.setSubtitleTrack(this.getInitialSubtitleTrack(), false);
      // trigger onTracksChange to make sure the state is up-to-date with all the relevant tracks.
      this.onTracksChange();
    });

    // 😐🔫 Nowtilus provide a `<pssh>` element instead of `<cenc:pssh>` which is not valid...
    // TODO: EMP-18318 remove this once the ticket has been resolved.
    this.mediaPlayer.on(MediaPlayer.events.MANIFEST_LOADED, ({ data }) => {
      (data as any).Period_asArray?.forEach((period: any) => {
        period.AdaptationSet_asArray?.forEach((adaptationSet: any) => {
          adaptationSet.ContentProtection_asArray?.forEach(
            (contentProtection: any) => {
              // dash.js expects the xml2json parser to generate an object with { __text: string }
              // but we get a string directly, this simply changes that so it matches the interface expected
              // by dash.js
              // NOTE! if dash.js is updated to NOT provide the manifest by reference anymore this won't work...
              const pssh = contentProtection.pssh;
              if (typeof pssh === "string") {
                contentProtection.pssh = {
                  __text: pssh,
                };
              }
            }
          );
        });
      });
    });
  }

  private getCurrentTrackFor(type: MediaType) {
    try {
      // TODO: there is no null check here:https://github.com/Dash-Industry-Forum/dash.js/blame/development/src/streaming/MediaPlayer.js#L1588
      // therefore we need to wrap this in a try catch. When that is fixed this workaround can be removed
      return this.mediaPlayer.getCurrentTrackFor(type);
    } catch (e) {
      return null;
    }
  }

  private setupStartGapDetection() {
    // Workaround for dash.js not detecting gaps in the beginning of a stream
    const onBufferLevelUpdated = (e: any) => {
      if (
        !("mediaType" in e) ||
        !("bufferLevel" in e) ||
        e.mediaType === "text" ||
        this.getPlaybackState() !== PlaybackState.LOADING
      ) {
        return;
      }

      const processor = this.mediaPlayer
        ?.getActiveStream()
        ?.getProcessors()
        .find((processor) => processor.getType() === e.mediaType);

      const bufferRanges = processor?.getBuffer().getAllBufferRanges();

      if (bufferRanges.length) {
        const start = bufferRanges.start(0);
        // If the video/audio doesn't have anything buffered (bufferLevel) but there is a startTime dash.js has infact loaded _something_
        // for that mediaType, so we can safely assume that there is indeed a gap and we should seek to whatever is actually buffered.
        if (e.bufferLevel === 0 && start > 0) {
          this.mediaPlayer.off(
            MediaPlayer.events.BUFFER_LEVEL_UPDATED,
            onBufferLevelUpdated
          );
          this.videoElement.currentTime = start;
        }
      }
    };
    this.mediaPlayer.on(
      MediaPlayer.events.BUFFER_LEVEL_UPDATED,
      onBufferLevelUpdated
    );
  }

  private async _load({
    src,
    license,
    startTime,
    subtitle,
    audio,
  }: TLoadParameters) {
    this.src = src;
    const customConfiguration =
      this.instanceSettings.initOptions.customDashJSConfiguration || {};
    const configuration = merge({}, DashJsDefaults, customConfiguration, {
      streaming: {
        text: {
          defaultEnabled: !!subtitle?.language,
        },
        trackSwitchMode: {
          // Always discard previous audio track (language) buffer when switching
          // Also need this for the https://github.com/Dash-Industry-Forum/dash.js/issues/3804 workaround
          audio: "alwaysReplace",
        },
      },
    });
    this.mediaPlayer.updateSettings(configuration);

    const isHEVCDrmSupported = await getSupportedDrm(
      this.instanceSettings.supportedKeySystem,
      "hvc1.1.6.L93.90"
    );
    this.mediaPlayer.registerCustomCapabilitiesFilter(
      getCapabilitiesFilter(!!isHEVCDrmSupported)
    );

    if (audio?.language) {
      this.audioSettings = audio;

      this.mediaPlayer.setInitialMediaSettingsFor("audio", {
        lang: audio.language,
        role: getDashAudioKind(audio.kind),
      });
    }

    if (subtitle?.language) {
      this.mediaPlayer.setInitialMediaSettingsFor("text", {
        lang: subtitle.language,
        role: getDashTextKind(subtitle.kind),
      });
    }

    this.setContractRestrictedConfiguration();
    this.setContentSpecificConfiguration();
    this.setLicense(this.instanceSettings.supportedKeySystem, license);

    if (startTime === undefined || startTime === 0) {
      this.setupStartGapDetection();
    }

    this.mediaPlayer.attachSource(
      startTime === undefined ? src : `${src}#t=${startTime}`
    );

    this.once(EngineEvents.LOADED, () => {
      // when switching sourceBuffers this needs to be set to true otherwise dash.js will pause
      // this happens if reuseExistingSourceBuffers is `false` or when switching from period without DRM to one with.
      this.videoElement.autoplay = true;
    });

    super.load({
      src,
      license,
      startTime,
      audio,
      subtitle,
    });
  }

  load(parameters: TLoadParameters) {
    // load doesn't return a promise but since we want to use async/await we call a private method
    this._load(parameters);
  }

  protected onLoaded(): void {
    const presentationTimeOffset = this.mediaPlayer
      .getDashMetrics()
      ?.getCurrentManifestUpdate()
      ?.representationInfo?.[0]?.presentationTimeOffset;

    if (!this.isLive() && presentationTimeOffset) {
      this.setUTCStartTime(presentationTimeOffset * 1000);
    }

    super.onLoaded();
  }

  setPreferredLanguages() {
    // no-op
  }

  addSubtitleEvents(): void {
    // no-op
  }

  addAudioTrackEvents() {
    // no-op
  }

  isLive() {
    const isDynamic = this.mediaPlayer.isReady()
      ? this.mediaPlayer.isDynamic()
      : null;
    if (isDynamic !== null) {
      return isDynamic;
    }
    return this.instanceSettings.playResponse?.streamInfo?.live ?? false;
  }

  setContractRestrictedConfiguration() {
    if (!this.instanceSettings.playResponse) {
      return;
    }
    const { minBitrate, maxBitrate, maxResHeight } =
      this.instanceSettings.playResponse?.contractRestrictions || {};

    if (!minBitrate && !maxBitrate && !maxResHeight) {
      return;
    }

    const settings: MediaPlayerSettingClass = {
      streaming: {
        abr: {
          ...(minBitrate && { minBitrate: { audio: -1, video: minBitrate } }),
          ...(maxBitrate && { maxBitrate: { audio: -1, video: maxBitrate } }),
        },
      },
    };
    this.mediaPlayer.updateSettings(settings);
  }

  setContentSpecificConfiguration() {
    // http://cdn.dashjs.org/latest/jsdoc/module-Settings.html
    const settings: any = {
      streaming: {
        delay: {},
      },
    };
    const currentPlaybackObject = this.instanceSettings?.formats?.find(
      (f) => f.mediaLocator === this.src
    );
    if (currentPlaybackObject?.liveDelay) {
      settings.streaming.delay.liveDelay =
        currentPlaybackObject.liveDelay / 1000; // DashJS expects the live delay to be in seconds
      settings.streaming.delay.useSuggestedPresentationDelay = false;
    }
    if (this.instanceSettings.mediaInfo?.lowLatency) {
      this.mediaPlayer.updateSettings(DashJsLowLatency);
    }

    this.mediaPlayer.updateSettings(settings);
  }

  setLicense(supportedKeySystem?: DRMType, license?: ILicense) {
    if (!supportedKeySystem || !license) {
      return;
    }
    const licenseObject = license[supportedKeySystem];

    if (licenseObject && supportedKeySystem) {
      this.keySystem = supportedKeySystem;
      let keySystemOptions: ProtectionDataSet = {};
      keySystemOptions[supportedKeySystem] = {
        serverURL: licenseObject.licenseServerUrl,
        priority: 0, // 0 = highest prio
      };

      if (this.instanceSettings.playResponse?.playToken) {
        keySystemOptions[supportedKeySystem].httpRequestHeaders = {
          authorization: `Bearer ${this.instanceSettings.playResponse.playToken}`,
        };
        keySystemOptions[supportedKeySystem].withCredentials = false;
      }

      if (supportedKeySystem === KeySystem.WIDEVINE) {
        keySystemOptions = this.setWidevineSpecifics(keySystemOptions);
      }
      this.mediaPlayer.setProtectionData(keySystemOptions);
    }
  }

  setWidevineSpecifics(keySystemOptions: any) {
    keySystemOptions[KeySystem.WIDEVINE].videoRobustness = "SW_SECURE_CRYPTO";
    keySystemOptions[KeySystem.WIDEVINE].audioRobustness = "SW_SECURE_CRYPTO";
    return keySystemOptions;
  }

  getSeekable() {
    if (!this.mediaPlayer.isReady()) {
      return super.getSeekable();
    }
    const dvrInfo = this.mediaPlayer
      ?.getDashMetrics()
      ?.getCurrentDVRInfo("video");
    if (dvrInfo) {
      return dvrInfo.range;
    }
    return super.getSeekable();
  }

  protected onError() {
    // no-op, handled by onDashJsError
  }

  private onDashJsError({ error }: any) {
    const playerError = new DashJsPlayerError(error.message, {
      type: getErrorTypeFromCode(error.code),
      code: error.code,
      rawError: error,
    });
    if (playerError) {
      this.emit(EngineEvents.ERROR, playerError);
    }
  }

  private activeTrack: TextTrack | undefined;
  /**
   *  hide the active textTrack and dispatch cues as events to be rendered
   *  as HTML instead of WebVTT.
   */
  private handleActiveTextTrack(textTrack?: TextTrack) {
    Array.from(this.videoElement.textTracks).forEach((track) => {
      if (track !== textTrack) {
        track.mode = "disabled";
      }
    });

    if (!textTrack) {
      this.activeTrack = undefined;
      return;
    }

    this.activeTrack = textTrack;
    textTrack.mode = "hidden";

    const activeCues = (
      textTrack.activeCues ? Array.from(textTrack.activeCues) : []
    ) as VTTCue[];
    this.emit(EngineEvents.SUBTITLE_CUE_CHANGED, activeCues);

    textTrack.oncuechange = () => {
      const activeCues = (
        textTrack.activeCues ? Array.from(textTrack.activeCues) : []
      ) as VTTCue[];

      this.emit(EngineEvents.SUBTITLE_CUE_CHANGED, activeCues);
    };
  }

  protected onTextTracksChange(shouldUpdatePreferences = true) {
    if (
      // if the mediaPlayer no longer have tracks but the videoElement does
      // it means that there was a period switch that temporarily removes tracks
      // ignore this since when the textTracks are back we don't want them disabled.
      this.mediaPlayer.getTracksFor("text").length === 0 &&
      this.videoElement.textTracks.length > 0
    ) {
      return;
    }

    const track = this.getSubtitleTrack();
    this.emit(EngineEvents.SUBTITLE_CHANGED, {
      track,
      shouldUpdatePreferences,
    });
    this.emit(EngineEvents.SUBTITLE_CUE_CHANGED, []);

    if (!track && this.activeTrack) {
      this.handleActiveTextTrack(undefined);
      return;
    }

    for (let i = 0, len = this.videoElement.textTracks.length; i < len; i++) {
      const textTrack = this.videoElement.textTracks[i];
      if (track && textTrack.mode === "showing") {
        this.handleActiveTextTrack(textTrack);
      }
    }
  }

  private setLowLatencyLiveCatchup(enabled: boolean) {
    // @ts-ignore, getLowLatencyModeEnabled() missing from type definition
    if (!this.mediaPlayer.getLowLatencyModeEnabled()) {
      return;
    }
    this.mediaPlayer.updateSettings({
      streaming: {
        liveCatchup: {
          enabled,
        },
      },
    });
  }

  seekTo(pos: number): void {
    this.setLowLatencyLiveCatchup(false);
    super.seekTo(pos);
  }

  seekToLive(): void {
    this.setLowLatencyLiveCatchup(true);
    super.seekToLive();
  }

  getUTCCurrentTime() {
    if (!this.mediaPlayer.isReady()) {
      return 0;
    }
    if (this.isLive()) {
      return this.mediaPlayer?.timeAsUTC() * 1000 ?? 0;
    }
    return super.getUTCCurrentTime();
  }

  getUTCDuration() {
    if (!this.mediaPlayer.isReady()) {
      return 0;
    }
    if (this.isLive()) {
      return this.mediaPlayer?.durationAsUTC() * 1000 ?? 0;
    }
    return super.getUTCDuration();
  }

  getUTCSeekable() {
    if (!this.mediaPlayer.isReady()) {
      return { start: -1, end: -1 };
    }
    if (this.isLive()) {
      const seekable = this.getSeekable();
      return {
        start: seekable.start * 1000,
        end: seekable.end * 1000,
      };
    }
    return super.getUTCSeekable();
  }

  setSubtitleTrack(track?: Track, shouldUpdatePreferences?: boolean) {
    if (!this.mediaPlayer.isReady()) {
      return;
    }

    let trackIndex = -1;
    if (track && track.id) {
      const textTracks = this.mediaPlayer?.getTracksFor("text") || [];
      trackIndex = textTracks.findIndex((t) => t.id === track.id);
    } else {
      const textTracks = this.mediaPlayer?.getTracksFor("text") || [];
      trackIndex = textTracks.findIndex((t) =>
        t.roles?.includes("forced-subtitle")
      );
    }
    const enableTrack = trackIndex !== -1;
    this.mediaPlayer.setTextTrack(trackIndex);
    this.mediaPlayer.enableText(enableTrack);
    this.mediaPlayer.enableForcedTextStreaming(enableTrack);
    this.onTextTracksChange(shouldUpdatePreferences);
  }

  getInitialSubtitleTrack() {
    const textTracks = this.mediaPlayer?.getTracksFor("text");
    const preferedSubtitles = getPreferences().subtitle;
    const initialTrack = textTracks.find((track) => {
      const kind = track.roles && getTextKind(track.roles);
      return (
        track.lang === preferedSubtitles?.language &&
        kind === preferedSubtitles.kind
      );
    });

    return initialTrack && createTrack(initialTrack);
  }

  getSubtitleTrack() {
    if (!this.mediaPlayer?.isReady()) {
      return;
    }
    const track = this.getCurrentTrackFor("text");
    if (track?.roles?.includes("forced-subtitle")) {
      this.mediaPlayer.enableText(true);
      return createTrack(track);
    }
    if (this.mediaPlayer.isTextEnabled() && track) {
      return createTrack(track);
    }
  }

  getSubtitleTracks() {
    if (!this.mediaPlayer.isReady()) {
      return [];
    }
    return this.filterVisibleSubtitleTracks(
      (
        this.mediaPlayer
          ?.getTracksFor("text")
          ?.map((track) => createTrack(track)) ?? []
      ).filter(
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

  setAudioTrack(track: Track) {
    if (!this.mediaPlayer.isReady()) {
      return [];
    }
    const tracks = this.mediaPlayer?.getTracksFor("audio") ?? [];
    const internalTrack = tracks.find((t) => t.id === track.id);
    if (internalTrack) {
      this.audioSettings = {
        language: internalTrack.lang || undefined,
        kind: getAudioKind(internalTrack.roles || []),
      };
      this.mediaPlayer.setCurrentTrack(internalTrack);
    }
  }

  getAudioTrack() {
    if (!this.mediaPlayer.isReady()) {
      return;
    }
    const track = this.getCurrentTrackFor("audio");
    if (track) {
      return createTrack(track);
    }
  }

  getAudioTracks() {
    if (!this.mediaPlayer.isReady()) {
      return [];
    }
    return (
      this.mediaPlayer
        ?.getTracksFor("audio")
        ?.map((track) => createTrack(track)) ?? []
    );
  }

  getQualityLevel(): QualityLevel {
    if (!this.mediaPlayer.isReady()) {
      return super.getQualityLevel();
    }
    const index = this.mediaPlayer.getQualityFor("video");
    if (index > -1) {
      const qualityLevel = this.getQualityLevels().find(
        (level) => level.id === index
      );
      if (qualityLevel) {
        return qualityLevel;
      }
    }
    return super.getQualityLevel();
  }

  getQualityLevels(): QualityLevel[] {
    if (!this.mediaPlayer.isReady()) {
      return [];
    }
    const qualityLevels = this.mediaPlayer
      ?.getBitrateInfoListFor("video")
      ?.map((bitrateInfo, index) => {
        const qualityLevel: QualityLevel = {
          id: index,
          bandwidth: bitrateInfo.bitrate,
          width: bitrateInfo.width,
          height: bitrateInfo.height,
        };
        qualityLevel.name = getQualityLevelName(qualityLevel);
        return qualityLevel;
      });

    return [...super.getQualityLevels(), ...qualityLevels];
  }

  setQualityLevel(level: QualityLevel) {
    if (!this.mediaPlayer.isReady()) {
      return;
    }
    if (level.id === AUTO_QUALITY_LEVEL_DEFINITION.id) {
      this.mediaPlayer.updateSettings({
        streaming: {
          abr: {
            autoSwitchBitrate: {
              video: true,
            },
          },
        },
      });
    } else {
      this.mediaPlayer.updateSettings({
        streaming: {
          abr: {
            autoSwitchBitrate: {
              video: false,
            },
          },
        },
      });
      this.mediaPlayer.setQualityFor("video", level.id, true);
    }
  }

  destroy() {
    this.mediaPlayer.destroy();
    super.destroy();
  }
}
