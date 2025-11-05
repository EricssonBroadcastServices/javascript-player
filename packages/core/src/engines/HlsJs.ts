// SPDX-FileCopyrightText: 2024 Red Bee Media Ltd <https://www.redbeemedia.com/>
//
// SPDX-License-Identifier: MIT

import Hls, {
  ErrorData,
  Events,
  FragChangedData,
  HlsConfig,
  ErrorTypes as HlsJsErrorTypes,
  MediaPlaylist,
} from "hls.js";

import {
  ErrorTypes,
  HlsJsPlayerError,
  PlaybackState,
  QualityLevel,
  Seekable,
  Track,
  getLabel,
} from "@ericssonbroadcastservices/js-player-shared";

import { isLGTV } from "../device/common";
import { InstanceSettingsInterface } from "../utils/interfaces";
import { AbstractBaseEngine, getQualityLevelName } from "./AbstractBaseEngine";
import { HlsJs as defaultConfiguration } from "./defaultConfigurations";
import {
  EngineEvents,
  MetadataEngineEvent,
  TAudioKind,
  TLoadParameters,
  TTextKind,
} from "./interfaces";
import {
  TRestrictions,
  getResolutionAndBitrateRestrictions,
} from "./utils/restrictions";

const LIVE_EDGE_TOLERANCE = 6; // seconds

function getErrorType({ type, details }: ErrorData): ErrorTypes {
  switch (type) {
    case HlsJsErrorTypes.NETWORK_ERROR:
      return ErrorTypes.NETWORK;
    case HlsJsErrorTypes.MEDIA_ERROR:
      return details?.includes("CODEC") ? ErrorTypes.CODEC : ErrorTypes.MEDIA;
    case HlsJsErrorTypes.MUX_ERROR:
    case HlsJsErrorTypes.OTHER_ERROR:
      return ErrorTypes.PLAYER_ENGINE;
    default:
      return ErrorTypes.OTHER;
  }
}

function createTrack(track: MediaPlaylist): Track {
  let kind: TAudioKind | TTextKind;
  const characteristics = track.attrs?.CHARACTERISTICS;
  if (track.type === "AUDIO") {
    if (!characteristics) {
      kind = "main";
    } else if (characteristics.includes("accessibility")) {
      kind = "description";
    } else {
      // default to 'alternative' if we cannot find any matching characteristic.
      // (This should almost never happen with normal streams/tracks)
      kind = "alternative";
    }
  }
  if (["SUBTITLES", "CLOSED-CAPTIONS"].includes(track.type)) {
    if (track.forced) {
      kind = "forced";
    } else if (!characteristics) {
      kind = "subtitles";
    } else if (
      characteristics.includes("transcribes") ||
      characteristics.includes("describes")
    ) {
      // Either 'public.accessibility.transcribes-spoken-dialog' or 'public.accessibility.describes-music-and-sound' (can also be both)
      kind = "captions";
    } else {
      // default to an empty string if we cannot find any matching characteristic.
      // (This should almost never happen with normal streams/tracks)
      kind = "";
    }
  }
  return {
    id: track.id.toString(),
    language: track.lang as string,
    label: track.name || getLabel(track.lang as string),
    raw: track,
    kind,
  };
}

export class HlsJs extends AbstractBaseEngine {
  readonly name = "Hls.js";
  readonly playertechVersion = Hls.version;
  private currentBitrate = 0;
  private hls: Hls;

  private src?: string;
  private recoveryAttempts = 0;

  protected maxRecoveryAttempts = 1;

  constructor(
    videoElement: HTMLVideoElement,
    instanceSettings: InstanceSettingsInterface
  ) {
    super(videoElement, instanceSettings);

    const configuration: Partial<HlsConfig> = {
      debug: false,
      // TODO: EMP-18317 remove `xhrSetup` once LG/Nowtilus supports https again...
      xhrSetup: (xhr, url) => {
        // 😐🔫 Workaround to allow playback of SSAI streams on LG 2017-2019...
        if (isLGTV() && url.includes("redbee.serverside.ai")) {
          url = url.replace("https://", "http://");
        }
        xhr.open("GET", url, true);
      },
    };
    const customConfiguration =
      this.instanceSettings.initOptions.customHlsJsConfiguration || {};

    this.hls = new Hls(
      Object.assign(configuration, defaultConfiguration, customConfiguration)
    );
    this.hls.subtitleDisplay = false;

    this.setupEventListeners();
  }

  protected setupEventListeners() {
    super.setupEventListeners();
    this.hls.on(Hls.Events.FRAG_CHANGED, this.onFragChanged.bind(this));
    this.hls.on(Hls.Events.ERROR, this.onHlsError.bind(this));
    this.hls.on(
      Hls.Events.AUDIO_TRACK_SWITCHED,
      this.onAudioTrackChange.bind(this)
    );
  }

  load({ src, license, startTime, audio, subtitle }: TLoadParameters) {
    // TODO: fix typing issue when overriding this method
    const isNovaCustomer =
      this.instanceSettings.initOptions.customer === "Nova";

    let sourceStartTime = startTime;
    this.src = src;

    if (isNovaCustomer) {
      const urlObj = new URL(src);
      const encodedT = urlObj.searchParams.get("t");
      const t = encodedT ? decodeURIComponent(encodedT) : undefined;
      sourceStartTime = t ? new Date(t).getTime() / 1000 : undefined;

      urlObj.searchParams.delete("t");
      this.src = urlObj.toString();
    }

    this.src = src;
    this.hls.loadSource(this.src);
    this.hls.attachMedia(this.videoElement);
    this.hls.once(Hls.Events.MANIFEST_PARSED, async () => {
      this.setResolutionAndBitrateRestrictions(
        await getResolutionAndBitrateRestrictions(
          this.instanceSettings.playResponse?.contractRestrictions
        )
      );
      this.setContentSpecificConfiguration();
      this.hls.startLoad(
        sourceStartTime === undefined ? -1 : Math.floor(sourceStartTime)
      );
    });
    super.load({
      src: this.src,
      license,
      startTime: sourceStartTime,
      audio,
      subtitle,
    });
  }

  stop() {
    this.hls.detachMedia();
    this.setPlaybackState(PlaybackState.IDLE);
  }

  isLive() {
    return this.videoElement.duration === Infinity;
  }

  isAtLiveEdge() {
    return (
      this.hls.liveSyncPosition !== null &&
      this.getCurrentTime() >= this.hls.liveSyncPosition - LIVE_EDGE_TOLERANCE
    );
  }

  setResolutionAndBitrateRestrictions({
    minBitrate,
    maxBitrate,
    maxResHeight,
  }: TRestrictions) {
    if (!minBitrate && !maxBitrate && !maxResHeight) return;
    const levels = this.hls.levels;
    const levelsToRemove = []; // We need to store them here since the index will change if we remove them
    for (const levelIndex in levels) {
      const level = levels[levelIndex];
      if (
        (minBitrate && level.bitrate < minBitrate) ||
        (maxBitrate && level.bitrate > maxBitrate) ||
        (maxResHeight && level.height > maxResHeight)
      ) {
        levelsToRemove.push(levelIndex);
      }
    }
    const sortedLevels = levelsToRemove.sort().reverse();
    sortedLevels.forEach((levelIdentifier) => {
      this.hls.removeLevel(Number(levelIdentifier));
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
        this.hls.config.liveSyncDuration =
          currentPlaybackObject.liveDelay / 1000;
      }
    }
  }

  setQualityLevel(level: QualityLevel): void {
    this.hls.nextLevel = level.id;
    this.hls.loadLevel = level.id;
  }

  getQualityLevel(): QualityLevel {
    const level = this.hls.levels[this.hls.currentLevel];
    if (level) {
      const qualityLevel = this.getQualityLevels().find(
        (l) => l.bandwidth === level.bitrate
      );
      if (qualityLevel) {
        return qualityLevel;
      }
    }
    return super.getQualityLevel();
  }

  getQualityLevels(): QualityLevel[] {
    if (!this.hls.levels || !Array.isArray(this.hls.levels)) return [];
    const qualityLevels = this.hls.levels.map((level) => {
      const index = this.hls.levels.findIndex(
        (l) => l.bitrate === level.bitrate
      );
      const framerate = level.attrs["FRAME-RATE"];
      const qualityLevel: QualityLevel = {
        id: index,
        bandwidth: level.bitrate,
        width: level.width,
        height: level.height,
        framerate: framerate ? parseInt(framerate, 10) : undefined,
      };
      qualityLevel.name = getQualityLevelName(qualityLevel);
      return qualityLevel;
    });
    return [...super.getQualityLevels(), ...qualityLevels];
  }

  setSubtitleTrack(track?: Track) {
    const tracks = this.hls.subtitleTracks;
    const index = tracks.findIndex((t) => track && t.id === Number(track.id));
    this.hls.subtitleDisplay = index !== -1;
    this.hls.subtitleTrack = -1; // ugly hack, without this the first attempt to set track won't work in HlsJs
    // Note: Hls.js also activate tracks with the same "groupId" ("GROUP-ID" in the manifest) when you set a track (this is a feature)
    this.hls.subtitleTrack = index;
    // Visibility needs to be set to hidden for all tracks that are set to showing. This is due to: https://github.com/video-dev/hls.js/issues/4530
    Array.from(this.videoElement.textTracks || []).forEach((track) => {
      if (track.mode === "showing") {
        track.mode = "hidden";
      }
    });
  }

  getSubtitleTrack() {
    if (this.hls.subtitleTrack !== -1) {
      if (this.hls.subtitleDisplay) {
        const track = this.hls.subtitleTracks[this.hls.subtitleTrack];
        if (track) {
          return createTrack(track);
        }
      }
    }
  }

  getSubtitleTracks() {
    const tracks = this.hls.subtitleTracks;
    return this.filterVisibleSubtitleTracks(
      tracks
        .map((track) => {
          return createTrack(track);
        })
        .filter(
          (track, index, array) =>
            array.findIndex(
              (compTrack) =>
                track.language === compTrack.language &&
                track.id === compTrack.id &&
                track.kind === compTrack.kind
            ) === index
        )
    );
  }

  setAudioTrack(track: Track) {
    if (track) {
      const audioTrack = this.hls.audioTracks.find(
        (audioTrack) => Number(audioTrack.id) === Number(track.id)
      );
      if (audioTrack) {
        this.hls.audioTrack = Number(audioTrack.id);
      }
    }
  }

  getAudioTrack() {
    const audioTrack = this.hls.audioTracks.find(
      (audioTrack) => audioTrack.id === this.hls.audioTrack
    );
    if (audioTrack) {
      return createTrack(audioTrack);
    }
  }

  getAudioTracks() {
    const activeTrack = this.hls.audioTracks.find(
      (audioTrack) => audioTrack.id === this.hls.audioTrack
    );
    return (
      this.hls.audioTracks
        // filter out audioTracks that is not the same group as the running track
        .filter((audioTrack) => audioTrack.groupId === activeTrack?.groupId)
        .map((audioTrack) => createTrack(audioTrack))
        .filter(
          (track, index, array) =>
            array.findIndex(
              (compTrack) =>
                track.language === compTrack.language &&
                track.kind === compTrack.kind &&
                track.label === compTrack.label
            ) === index
        )
    );
  }

  onFragChanged(_: Events.FRAG_CHANGED, data: FragChangedData) {
    const tags = data.frag.tagList;
    const level = this.hls.levels[data.frag.level];
    const bitrate = level.bitrate;
    if (bitrate !== this.currentBitrate) {
      this.emit(EngineEvents.BITRATE_CHANGED, {
        bitrate,
        width: level.width,
        height: level.height,
      });
      this.currentBitrate = bitrate;
    }

    if (!this.utcStartTime && data.frag.programDateTime) {
      this.setUTCStartTime(data.frag.programDateTime - data.frag.start * 1000);
    }

    if (tags) {
      tags.forEach((tag) => {
        if (tag.includes("EXT-X-DATERANGE")) {
          const metadataEvent: MetadataEngineEvent = {
            event: tag,
            engineName: "Hls.js",
            engineVersion: Hls.version,
          };
          this.emit(EngineEvents.METADATA_EVENT, metadataEvent);
        }
      });
    }
  }

  onHlsError(_event: Events.ERROR, data: ErrorData) {
    if (data.fatal) {
      const playerError = new HlsJsPlayerError(data.details, {
        type: getErrorType(data),
      });
      if (this.recoveryAttempts >= this.maxRecoveryAttempts) {
        this.emit(EngineEvents.ERROR, playerError);
        return;
      }
      this.recoveryAttempts += 1;
      switch (data.type) {
        case Hls.ErrorTypes.MEDIA_ERROR:
          console.warn("fatal media error encountered, try to recover");
          this.hls.recoverMediaError();
          break;
        default:
          this.emit(EngineEvents.ERROR, playerError);
          break;
      }
    }
  }

  onError() {
    // no-op, handled by onHlsError
  }

  getSeekable(): Seekable {
    // Use the same method as hls.js uses to determine seekable range
    // https://github.com/video-dev/hls.js/blob/master/src/controller/buffer-controller.ts#L855
    // On older browsers the mediasource seekable cannot be updated so we have to get the range manually.
    const level = this.hls.levels?.find(
      (level) => level.id === this.hls.loadLevel
    );
    const levelDetails = level?.details;
    if (levelDetails?.fragments) {
      const fragments = levelDetails?.fragments;
      const start = Math.max(0, fragments[0].start);
      const end = Math.max(start, start + levelDetails.totalduration);
      return {
        start,
        end,
      };
    }
    return super.getSeekable();
  }

  seekTo(pos: number) {
    // hls.js can fail to seek to a non integer position.
    super.seekTo(Math.round(pos));
  }

  seekToLive() {
    const livePosition = this.hls.liveSyncPosition;
    if (livePosition) {
      this.videoElement.currentTime = livePosition;
    }
  }

  destroy() {
    if (this.hls) {
      this.hls.destroy();
    }
    super.destroy();
  }
}
