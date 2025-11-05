// SPDX-FileCopyrightText: 2024 Red Bee Media Ltd <https://www.redbeemedia.com/>
//
// SPDX-License-Identifier: MIT

import {
  AudioTrack,
  Player,
  PlayerAPI,
  PlayerEvent,
  SubtitleCueEvent,
  TextTrack,
} from "bitmovin-player";

import {
  AUTO_QUALITY_LEVEL_DEFINITION,
  QualityLevel,
  Track,
  getLabel,
} from "@ericssonbroadcastservices/js-player-shared";

import { InstanceSettingsInterface } from "../utils/interfaces";
import {
  AbstractBaseEngine,
  getAudioKind,
  getQualityLevelName,
  getTextKind,
} from "./AbstractBaseEngine";
import {
  EngineEvents,
  SubtitleCueChangeEngineEvent,
  TLoadParameters,
} from "./interfaces";

function createAudioTrack(track: AudioTrack, id: number): Track {
  const roles = track.role
    ?.map((el) => el.value)
    .filter((el) => el !== undefined) as string[] | undefined;
  const kind = getAudioKind(roles ?? []);

  return {
    id,
    language: track.lang || "",
    label: track.label || getLabel(track.lang),
    kind,
    raw: track,
  };
}

function createSubtitleTrack(track: TextTrack, id: number): Track {
  const roles = track.role
    ?.map((el) => el.value)
    .filter((el) => el !== undefined) as string[] | undefined;
  const kind = getTextKind(roles ?? []);

  return {
    id,
    language: track.lang || "",
    label: track.label || getLabel(track.lang),
    kind,
    raw: track,
  };
}

function getSourceType(
  src: string
): "dash" | "hls" | "smooth" | "progressive" | null {
  const lower = src.toLowerCase();
  if (lower.includes(".mpd") || lower.includes(".dash")) return "dash";
  if (lower.includes(".m3u8")) return "hls";
  if (lower.includes(".ism/manifest") || lower.includes(".xml"))
    return "smooth";
  if (lower.endsWith(".mp4")) return "progressive";
  return null;
}

export class Bitmovin extends AbstractBaseEngine {
  readonly name = "Bitmovin";
  readonly playertechVersion: string = "";
  private bitmovinPlayer: PlayerAPI | undefined;
  private activeSubtitlesTrack: Track | undefined;
  private activeAudioTrack: Track | undefined;

  constructor(
    videoElement: HTMLVideoElement,
    instanceSettings: InstanceSettingsInterface
  ) {
    super(videoElement, instanceSettings);

    this.bitmovinPlayer =
      instanceSettings.initOptions.mediaContainer &&
      new Player(instanceSettings.initOptions.mediaContainer, {
        key: process.env.BITMOVIN_KEY || "",
        ui: false,
        // autoplay is handled on our side to guarantee a proper eventflow
        playback: { autoplay: false },
      });
    this.bitmovinPlayer?.setVideoElement(videoElement);
    this.playertechVersion = this.bitmovinPlayer?.version || "";

    this.setupEventListeners();
  }

  protected setupEventListeners() {
    if (!this.bitmovinPlayer) return;

    super.setupEventListeners();

    this.bitmovinPlayer.on(PlayerEvent.CueEnter, (event) => {
      const { vtt, text } = event as SubtitleCueEvent;
      this.emit(EngineEvents.SUBTITLE_CUE_CHANGED, [
        { ...vtt, text },
      ] as SubtitleCueChangeEngineEvent);
    });
    this.bitmovinPlayer.on(PlayerEvent.CueExit, () => {
      this.emit(EngineEvents.SUBTITLE_CUE_CHANGED, []);
    });
  }

  setQualityLevel(level: QualityLevel) {
    if (level.id === AUTO_QUALITY_LEVEL_DEFINITION.id) {
      this.bitmovinPlayer?.setVideoQuality("auto");
    } else {
      const newTrackId =
        this.bitmovinPlayer
          ?.getAvailableVideoQualities()
          .find((item) => item.height === level.height)?.id || "auto";
      this.bitmovinPlayer?.setVideoQuality(newTrackId);
    }
  }

  getQualityLevel(): QualityLevel {
    const tracks = this.bitmovinPlayer?.getAvailableVideoQualities();
    const activeTrack = this.bitmovinPlayer?.getVideoQuality();
    const activeTrackIndex = tracks?.findIndex(
      (item) => item.id === activeTrack?.id
    );

    if (
      !activeTrack ||
      activeTrackIndex === null ||
      activeTrackIndex === undefined ||
      activeTrackIndex < 0 ||
      activeTrack.id === "auto"
    ) {
      return super.getQualityLevel();
    }

    return {
      id: activeTrackIndex,
      bandwidth: activeTrack.bitrate,
      width: activeTrack.width ?? -1,
      height: activeTrack.height ?? -1,
    };
  }

  getQualityLevels(): QualityLevel[] {
    if (this.instanceSettings.loadOptions?.audioOnly) return [];

    const tracks = this.bitmovinPlayer?.getAvailableVideoQualities();
    if (!tracks || !Array.isArray(tracks)) return [];

    const qualityLevels = tracks.map((bitrateInfo, index) => {
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

  setAudioTrack(track: Track) {
    if (!this.bitmovinPlayer) {
      return;
    }
    this.activeAudioTrack = track;

    if (track) {
      this.bitmovinPlayer.setAudio(track.raw.id);
      this.onAudioTrackChange();
    }
  }

  getAudioTrack() {
    if (!this.bitmovinPlayer) {
      return undefined;
    }
    return this.activeAudioTrack;
  }

  getAudioTracks() {
    if (!this.bitmovinPlayer) {
      return [];
    }
    const tracks = this.bitmovinPlayer.getAvailableAudio();

    return tracks.map((track, index) => createAudioTrack(track, index)) ?? [];
  }

  setSubtitleTrack(track?: Track, shouldUpdatePreferences?: boolean) {
    if (!this.bitmovinPlayer) {
      return;
    }

    if (!track) {
      this.bitmovinPlayer.subtitles.disable(this.activeSubtitlesTrack?.raw.id);
    } else {
      this.bitmovinPlayer.subtitles.enable(track?.raw.id);
    }

    this.activeSubtitlesTrack = track;
    this.onTextTracksChange(shouldUpdatePreferences);
  }

  getSubtitleTrack() {
    if (!this.bitmovinPlayer) {
      return undefined;
    }

    return this.activeSubtitlesTrack;
  }

  getSubtitleTracks() {
    if (!this.bitmovinPlayer) {
      return [];
    }
    const tracks = this.bitmovinPlayer.subtitles.list();

    return this.filterVisibleSubtitleTracks(
      (
        tracks.map((track, index) => createSubtitleTrack(track, index)) ?? []
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

  private async _load({
    src,
    license,
    startTime,
    subtitle,
    audio,
  }: TLoadParameters) {
    if (!this.bitmovinPlayer) return;
    const isNovaCustomer =
      this.instanceSettings.initOptions.customer === "Nova";

    let sourceStartTime = startTime;
    let source = src;

    if (isNovaCustomer) {
      const urlObj = new URL(src);
      const encodedT = urlObj.searchParams.get("t");
      const t = encodedT ? decodeURIComponent(encodedT) : undefined;
      sourceStartTime = t ? new Date(t).getTime() / 1000 : undefined;

      urlObj.searchParams.delete("t");
      source = urlObj.toString();
    }

    const type = getSourceType(src);

    if (!type) {
      console.error(`[BitmovinEngine] Unknown source type for URL: ${src}`);
      throw new Error("Unsupported source type");
    }

    const config = {
      [type]: sourceStartTime ? `${src}#t=${sourceStartTime}` : source,
      drm: {
        widevine: {
          LA_URL: license?.["com.widevine.alpha"]?.licenseServerUrl,
        },
        fairplay: {
          LA_URL: license?.["com.apple.fps"]?.licenseServerUrl,
          certificateURL: license?.["com.apple.fps"]?.certificateUrl,
        },
        playready: {
          LA_URL: license?.["com.microsoft.playready"]?.licenseServerUrl,
        },
      },
    };

    this.bitmovinPlayer.load(config).then(() => {
      if (isNovaCustomer && this.bitmovinPlayer) {
        if (sourceStartTime) {
          const { start } = this.bitmovinPlayer.getSeekableRange();

          if (sourceStartTime < start) {
            this.seekTo(start);
          } else {
            this.seekTo(sourceStartTime);
          }
        }
      }

      super.load({
        src: source,
        license,
        startTime,
        audio,
        subtitle,
      });
    });
  }

  seekTo(pos: number) {
    // bitmovin can't seek to by setting this.videoElement.currentTime property.
    this.bitmovinPlayer?.seek(pos);
  }

  load(parameters: TLoadParameters) {
    this._load(parameters);
  }

  destroy() {
    this.bitmovinPlayer?.destroy();
    super.destroy();
  }
}
