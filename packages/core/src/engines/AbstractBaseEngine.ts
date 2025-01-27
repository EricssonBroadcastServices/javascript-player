// SPDX-FileCopyrightText: 2024 Red Bee Media Ltd <https://www.redbeemedia.com/>
//
// SPDX-License-Identifier: MIT

import {
  FilteredMediaEvent,
  TMediaEventFilter,
  getMediaEventFilter,
} from "@eyevinn/media-event-filter";

import {
  AUTO_QUALITY_LEVEL_DEFINITION,
  EmitterBaseClass,
  HtmlVideoElementEvents,
  PlaybackState,
  PlayerEngineName,
  QualityLevel,
  Track,
  getLabel,
} from "@ericssonbroadcastservices/js-player-shared";

import {
  ContractRestrictionsGuardian,
  IClientRestrictions,
} from "../utils/ContractRestrictionsGuardian";
import { InstanceSettingsInterface } from "../utils/interfaces";
import {
  EngineEvents,
  EngineEventsMap,
  HTMLMediaEvent,
  IHTMLMediaAudioTrack,
  TAudioKind,
  TLoadParameters,
  TTextKind,
} from "./interfaces";
import { convertError } from "./utils/NativeErrors";

declare global {
  class WebKitMediaKeys {
    constructor(keySession: any);
  }
  interface HTMLVideoElement extends HTMLMediaElement {
    getStartDate: () => Date;
    webkitKeys: any;
    webkitSetMediaKeys: (mediaKeys: any) => void;
  }
}

function createTrack(track: IHTMLMediaAudioTrack | TextTrack): Track {
  return {
    id: track.id,
    language: track.language || getLabel(track.language),
    label: track.label,
    kind: track.kind,
    raw: track,
  };
}

// time, in seconds, from edge considered live edge
export const LIVE_EDGE_THRESHOLD = 30;

export const SUPPORTED_TEXT_TRACK_KINDS = [
  "captions",
  "subtitles",
  "descriptions",
  "forced", // NON-STANDARD only appears in Safari for Forced CC/Subtitles
];

export const HIDDEN_TEXT_TRACK_KINDS = ["forced"];

export function getQualityLevelName(qualityLevel: QualityLevel): string {
  const suffixes: Record<number, string> = {
    720: "HD",
    1080: "Full HD",
    1440: "2K",
    2160: "4K",
  };
  const suffix = suffixes[qualityLevel.height];
  const resolution = qualityLevel.height?.toString();
  const mbps = (qualityLevel.bandwidth / 1_000_000).toFixed(1);
  const framerate = qualityLevel.framerate
    ? Math.round(qualityLevel.framerate)
    : undefined;

  let name = "";
  name += suffix ? `${resolution} ${suffix}` : resolution;
  name += ` @ ${mbps} mbps`;
  name += framerate && framerate > 30 ? `, ${Math.round(framerate)} fps` : "";

  return name;
}

// the naming of alternate tracks differs between Safari Native/hls.js and Shaka/Dash.js (hls/dash)
export function getDashTextKind(kind: TTextKind) {
  if (kind === "captions") return "caption";
  if (kind === "subtitles") return "subtitle";
  if (kind === "forced") return "forced-subtitle";
  return kind;
}

export function getDashAudioKind(kind?: TAudioKind) {
  return kind && ["description", "alternative"].includes(kind)
    ? "alternate"
    : kind;
}

// Roles will always include at least one string that will be 'subtitle'
// If it's an alternate track it will for example be '["subtitle", "caption"]'
// Forced: 'forced' will be present in hls and 'forced-subtitle' in dash
export function getTextKind(roles: string[]): TTextKind {
  if (roles.includes("caption")) return "captions";
  if (roles.includes("description")) return "descriptions";
  if (roles.includes("chapters")) return "chapters";
  if (roles.includes("metadata")) return "metadata";
  if (roles.includes("forced") || roles.includes("forced-subtitle"))
    return "forced";
  return "subtitles";
}

// audio roles will always include at least one string that will either be an empty string '""' or 'main'
// If it's an alternate track it will for example be '["main", "alternate"]'
export function getAudioKind(roles: string[]): TAudioKind | undefined {
  if (roles.includes("")) return "";
  if (roles.includes("alternate")) return "alternative";
  if (roles.includes("alternative")) return "alternative";
  if (roles.includes("main-desc")) return "main-desc";
  if (roles.includes("description")) return "description";
  if (roles.includes("commentary")) return "commentary";
  return "main";
}

export abstract class AbstractBaseEngine extends EmitterBaseClass<EngineEventsMap> {
  abstract readonly name: PlayerEngineName;
  abstract readonly playertechVersion: string;
  protected instanceSettings: InstanceSettingsInterface;
  protected videoElement: HTMLVideoElement;

  private isSubtitlesCueAlreadyUpdate = false;
  private shouldManuallyUpdateSubtitlesCue = false;
  public isSeekDisabled = false;
  protected supposedCurrentTime: number;
  protected mediaEventFilter: TMediaEventFilter;

  private guardian: ContractRestrictionsGuardian;
  private videoEventListeners: {
    type: string;
    listener: (event: any) => void;
  }[];

  private state: PlaybackState = PlaybackState.IDLE;

  private onTextTracksChangeReference: any;
  private onAudioTrackChangeReference: any;

  private droppedFrames: number;

  private fallbackUTCStartTime?: number;
  protected utcStartTime?: number;

  constructor(
    videoElement: HTMLVideoElement,
    instanceSettings: InstanceSettingsInterface
  ) {
    super();
    if (!videoElement) {
      throw "[AbstractBaseEngine] Invalid constructor";
    }
    this.instanceSettings = instanceSettings;
    this.videoElement = videoElement;
    this.guardian = new ContractRestrictionsGuardian(
      instanceSettings.playResponse?.contractRestrictions
    );

    this.droppedFrames = 0;
    this.supposedCurrentTime = 0;
    this.videoEventListeners = [];

    if (this.instanceSettings.initOptions.nativeSkin === true) {
      this.videoElement.setAttribute("controls", "controls");
    } else {
      this.videoElement.removeAttribute("controls");
    }
    this.videoElement.setAttribute("crossorigin", "anonymous");

    this.mediaEventFilter = this.setupMediaEventFilter(this.videoElement);
  }

  protected setupEventListeners() {
    this.addNativeVideoEvents();
    this.addSubtitleEvents();
    this.addAudioTrackEvents();

    this.on(EngineEvents.ERROR, this.onEngineEventError.bind(this));
  }

  /**
   * When playing live streams converts the provided
   * player time to UTC, for VOD it returns -1
   * @param  {number} time
   * @return {number}
   */
  protected convertToUTCTime(time: number): number {
    let startTime = this.utcStartTime ?? this.fallbackUTCStartTime;
    if (Number.isFinite(startTime) === false && this.isLive()) {
      const duration = this.videoElement.seekable.length
        ? this.videoElement.seekable.end(0)
        : this.videoElement.duration;

      startTime = Date.now() - duration * 1000;
      this.fallbackUTCStartTime = startTime;
    }
    return startTime !== undefined && Number.isFinite(startTime)
      ? startTime + time * 1000
      : -1;
  }

  protected setUTCStartTime(startTime: number) {
    this.utcStartTime = startTime;
  }

  protected setPlaybackState(state: PlaybackState) {
    this.state = state;
    this.emit(EngineEvents.STATE_CHANGED, this.state);
  }

  // the parameters here is only used to provide the interface for the implementors
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  load(parameters: TLoadParameters): void {
    this.setPlaybackState(PlaybackState.LOADING);
    this.once(EngineEvents.LOADED, () => {
      this.setPreferredLanguages({
        audio: parameters.audio,
        subtitle: parameters.subtitle,
      });
      this.onTracksChange();
    });
  }

  setPreferredLanguages({
    audio,
    subtitle,
  }: {
    audio?: { language?: string; kind?: TAudioKind };
    subtitle?: { language?: string; kind?: TTextKind };
  }) {
    if (audio?.language) {
      const audioTracks = this.getAudioTracks();
      let audioTrack = audioTracks.find((track) => {
        if (audio.kind) {
          return track.language === audio.language && track.kind === audio.kind;
        }
        return track.language === audio.language;
      });
      // If we cannot find an audio track with the correct language and kind, default to the first audio track.
      if (!audioTrack) {
        audioTrack = audioTracks[0];
      }
      this.setAudioTrack(audioTrack);
    }
    if (subtitle?.language) {
      const subtitleTrack = this.getSubtitleTracks().find((track) => {
        if (subtitle.kind) {
          return (
            track.language === subtitle.language && track.kind === subtitle.kind
          );
        }
        return track.language === subtitle.language;
      });
      this.setSubtitleTrack(subtitleTrack);
    } else {
      this.setSubtitleTrack(undefined);
    }
  }

  setClientRestrictions(clientRestrictions: Partial<IClientRestrictions>) {
    this.guardian.setClientRestrictions(clientRestrictions);
  }

  play() {
    const promise = this.videoElement.play();
    return promise || Promise.resolve();
  }

  pause() {
    if (this.videoElement) {
      this.videoElement.pause();
    }
  }

  stop() {
    this.videoElement.pause();
    this.videoElement.removeAttribute("src");
    this.videoElement.load();

    this.setPlaybackState(PlaybackState.IDLE);
  }

  public getPlaybackState(): PlaybackState {
    return this.state;
  }

  protected addNativeVideoEvents() {
    this.addOnVolumeChangeListener();
    this.addOnErrorListener();
  }

  private setupMediaEventFilter(videoElement: HTMLVideoElement) {
    return getMediaEventFilter({
      videoElement,
      allowResumeAfterEnded: true,
      callback: (event: FilteredMediaEvent) => {
        switch (event) {
          case FilteredMediaEvent.LOADED:
            this.onLoaded();
            break;
          case FilteredMediaEvent.SEEKING:
            this.onSeeking();
            break;
          case FilteredMediaEvent.SEEKED:
            this.onSeeked();
            break;
          case FilteredMediaEvent.BUFFERING:
            this.onBuffering();
            break;
          case FilteredMediaEvent.BUFFERED:
            this.onBuffered();
            break;
          case FilteredMediaEvent.PLAY:
            this.onPlay();
            break;
          case FilteredMediaEvent.PLAYING:
            this.onPlaying();
            break;
          case FilteredMediaEvent.PAUSE:
            this.onPause();
            break;
          case FilteredMediaEvent.ENDED:
            this.onEnded();
            break;
          case FilteredMediaEvent.TIME_UPDATE:
            this.onTimeUpdate();
            break;
          default:
            break;
        }
      },
    });
  }

  protected addOnVolumeChangeListener() {
    this.addVideoEventListener(
      HtmlVideoElementEvents.VOLUMECHANGE,
      this.onVolumeChange.bind(this)
    );
  }

  protected addOnErrorListener() {
    this.addVideoEventListener(
      HtmlVideoElementEvents.ERROR,
      this.onError.bind(this)
    );
  }

  protected addOnPlaybackRateChangedListener() {
    this.addVideoEventListener(
      HtmlVideoElementEvents.RATECHANGE,
      this.onPlaybackRateChanged.bind(this)
    );
  }

  addSubtitleEvents() {
    if (this.videoElement.textTracks) {
      this.videoElement.textTracks.addEventListener(
        "change",
        (this.onTextTracksChangeReference = this.onTextTracksChange.bind)
      );
    }
  }

  addAudioTrackEvents() {
    // The HTMLVideoElement type doesn't have audioTracks on it even though it's in the spec 🙄
    // @ts-ignore
    if (this.videoElement.audioTracks) {
      // @ts-ignore
      this.videoElement.audioTracks.addEventListener(
        "change",
        (this.onAudioTrackChangeReference = this.onAudioTrackChange.bind(this))
      );
    }
  }

  isPlaying() {
    return this.state === PlaybackState.PLAYING;
  }

  isLive(): boolean {
    return this.videoElement.duration === Infinity;
  }

  isAtLiveEdge(): boolean {
    if (this.isLive()) {
      const duration = this.getSeekable().end || this.getDuration();
      return this.getCurrentTime() > duration - LIVE_EDGE_THRESHOLD;
    }
    return false;
  }

  isEnded() {
    return this.videoElement.ended;
  }

  protected onLoaded() {
    this.setPlaybackState(
      this.videoElement.paused ? PlaybackState.PAUSED : PlaybackState.PLAYING
    );
    this.emit(EngineEvents.LOADED, undefined);
  }

  protected onPlaybackRateChanged() {
    this.emit(EngineEvents.PLAYBACK_RATE_CHANGED, {
      playbackRate: this.videoElement.playbackRate,
    });
  }

  protected onBuffering() {
    this.emit(EngineEvents.BUFFERING, undefined);
    this.setPlaybackState(PlaybackState.BUFFERING);
  }

  protected onBuffered() {
    this.emit(EngineEvents.BUFFERED, undefined);
    this.setPlaybackState(
      this.videoElement.paused ? PlaybackState.PAUSED : PlaybackState.PLAYING
    );
  }

  protected onPlay() {
    this.emit(EngineEvents.PLAY, undefined);
  }

  protected onPause() {
    this.setPlaybackState(PlaybackState.PAUSED);
    this.emit(EngineEvents.PAUSE, undefined);
  }

  protected onPlaying() {
    this.setPlaybackState(PlaybackState.PLAYING);
    this.emit(EngineEvents.PLAYING, undefined);
  }

  protected onTimeUpdate() {
    this.pollDroppedFrames();
    this.supposedCurrentTime = this.videoElement.currentTime;
    this.guardian.isValidPosition(this.getCurrentTime(), true);
    this.emit(EngineEvents.TIME_UPDATE, {
      currentTime: this.getCurrentTime(),
    });
  }

  private pollDroppedFrames() {
    if (this.videoElement.getVideoPlaybackQuality) {
      const currentDroppedFrames =
        this.videoElement.getVideoPlaybackQuality()?.droppedVideoFrames;
      if (currentDroppedFrames === this.droppedFrames) return;
      this.droppedFrames = currentDroppedFrames;
      this.emit(EngineEvents.DROPPED_FRAMES, this.droppedFrames);
    }
  }

  protected onSeeking() {
    if (this.shouldManuallyUpdateSubtitlesCue) {
      this.isSubtitlesCueAlreadyUpdate = false;
    }
    const seekCheck = this.guardian.isValidPosition(this.getCurrentTime());
    if (seekCheck.valid) {
      this.setPlaybackState(PlaybackState.SEEKING);
      this.emit(EngineEvents.SEEKING, undefined);
    } else {
      this.seekTo(seekCheck.validPosition);
    }
  }

  protected onSeeked() {
    const seekCheck = this.guardian.isValidPosition(this.getCurrentTime());
    if (seekCheck.valid) {
      this.setPlaybackState(
        this.videoElement.paused ? PlaybackState.PAUSED : PlaybackState.PLAYING
      );
      this.emit(EngineEvents.SEEKED, undefined);
    }

    if (!this.isSubtitlesCueAlreadyUpdate) {
      const track = this.getSubtitleTrack();
      for (let i = 0, len = this.videoElement.textTracks.length; i < len; i++) {
        const textTrack = this.videoElement.textTracks[i];
        if (
          track &&
          textTrack.mode === "hidden" &&
          SUPPORTED_TEXT_TRACK_KINDS.includes(textTrack.kind)
        ) {
          const activeCues = (
            textTrack.activeCues ? Array.from(textTrack.activeCues) : []
          ) as VTTCue[];
          this.emit(EngineEvents.SUBTITLE_CUE_CHANGED, activeCues);
        }
      }
    }
  }

  protected onVolumeChange() {
    this.emit(EngineEvents.VOLUME_CHANGE, {
      volume: this.getVolume(),
      muted: this.getMuted(),
    });
  }

  protected onEnded() {
    this.supposedCurrentTime = 0;
    this.setPlaybackState(PlaybackState.ENDED);
    this.emit(EngineEvents.ENDED, undefined);
  }

  protected onError(evt: HTMLMediaEvent) {
    if (evt) {
      const playerError = convertError(evt);
      if (playerError) {
        this.emit(EngineEvents.ERROR, playerError);
      }
    }
  }

  protected onEngineEventError() {
    this.setPlaybackState(PlaybackState.ERROR);
  }

  protected onTextTracksChange(shouldUpdatePreferences = true) {
    this.shouldManuallyUpdateSubtitlesCue = true;
    const track = this.getSubtitleTrack();
    this.emit(EngineEvents.SUBTITLE_CHANGED, {
      track,
      shouldUpdatePreferences,
    });

    this.emit(EngineEvents.SUBTITLE_CUE_CHANGED, []);

    for (let i = 0, len = this.videoElement.textTracks.length; i < len; i++) {
      const textTrack = this.videoElement.textTracks[i];
      if (
        track &&
        textTrack.mode === "hidden" &&
        SUPPORTED_TEXT_TRACK_KINDS.includes(textTrack.kind)
      ) {
        const activeCues = (
          textTrack.activeCues ? Array.from(textTrack.activeCues) : []
        ) as VTTCue[];
        this.emit(EngineEvents.SUBTITLE_CUE_CHANGED, activeCues);

        if (!textTrack.oncuechange) {
          textTrack.oncuechange = () => {
            this.isSubtitlesCueAlreadyUpdate = true;
            const activeCues = (
              textTrack.activeCues ? Array.from(textTrack.activeCues) : []
            ) as VTTCue[];
            this.emit(EngineEvents.SUBTITLE_CUE_CHANGED, activeCues);
          };
        }
      } else {
        textTrack.oncuechange = null;
      }
    }
  }

  protected onAudioTrackChange() {
    this.emit(EngineEvents.AUDIO_CHANGED, {
      track: this.getAudioTrack(),
    });
  }

  protected onTracksChange() {
    this.emit(EngineEvents.TRACKS_CHANGED, {
      subtitleTrack: this.getSubtitleTrack(),
      audioTrack: this.getAudioTrack(),
      subtitleTracks: this.getSubtitleTracks(),
      audioTracks: this.getAudioTracks(),
    });
  }

  protected filterVisibleSubtitleTracks(tracks: Track[]): Track[] {
    return tracks.filter(
      (track) => track.kind && !HIDDEN_TEXT_TRACK_KINDS.includes(track.kind)
    );
  }

  setAutoPlay() {
    this.videoElement.setAttribute("autoplay", "true");
  }

  seekTo(pos: number) {
    this.videoElement.currentTime = pos;
  }

  setPlaybackRate(rate: number) {
    this.videoElement.playbackRate = rate;
  }

  getCurrentTime() {
    return this.videoElement.currentTime;
  }

  getUTCCurrentTime() {
    return this.convertToUTCTime(this.getCurrentTime());
  }

  getDuration() {
    const seekable = this.getSeekable();
    if (seekable?.end) {
      return seekable.end;
    }
    return this.videoElement.duration || 0;
  }

  getUTCDuration() {
    return this.convertToUTCTime(this.getDuration());
  }

  getSeekable(): { start: number; end: number } {
    const seekable = this.videoElement.seekable;
    if (seekable.length > 0) {
      return {
        start: seekable.start(0),
        end: seekable.end(0),
      };
    }
    return {
      start: 0,
      end: 0,
    };
  }

  getUTCSeekable(): { start: number; end: number } {
    const seekable = this.getSeekable();
    return {
      start: this.convertToUTCTime(seekable.start),
      end: this.convertToUTCTime(seekable.end),
    };
  }

  seekToLive() {
    const end = this.getSeekable().end;
    if (end) {
      this.videoElement.currentTime = end;
    }
  }

  setVolume(vol: number) {
    if (!vol || isNaN(vol)) {
      vol = 1;
    }
    this.videoElement.muted = false;
    this.videoElement.volume = vol;
  }

  getVolume() {
    return this.videoElement.volume;
  }

  getMuted() {
    return this.videoElement.muted;
  }

  toggleMuted() {
    this.setMuted(!this.videoElement.muted);
  }

  setMuted(muted: boolean) {
    this.videoElement.muted = muted;
  }

  abstract setQualityLevel(level: QualityLevel): void;

  getQualityLevel(): QualityLevel {
    return AUTO_QUALITY_LEVEL_DEFINITION;
  }

  getQualityLevels(): QualityLevel[] {
    return [AUTO_QUALITY_LEVEL_DEFINITION];
  }

  setAudioTrack(track: Track) {
    // @ts-ignore
    const tracks: IHTMLMediaAudioTrack[] = this.videoElement.audioTracks;
    if (tracks && tracks.length > 1) {
      let audioSet = false;
      // if multiple tracks for one language exist, only set one
      Array.from(tracks).forEach((t) => {
        if (!audioSet && t.id === track.id && t.kind === track.kind) {
          t.enabled = true;
          audioSet = true;
        } else {
          t.enabled = false;
        }
      });
      if (!audioSet) {
        tracks[0].enabled = true;
      }
    }
  }

  getAudioTrack(): Track | undefined {
    // @ts-ignore
    const tracks: IHTMLMediaAudioTrack[] = this.videoElement.audioTracks
      ? // @ts-ignore
        Array.from(this.videoElement.audioTracks)
      : [];

    const activeTrack = tracks.find((track) => track.enabled);
    if (activeTrack) {
      return createTrack(activeTrack);
    }
  }

  getAudioTracks(): Track[] {
    const internalTracks: IHTMLMediaAudioTrack[] =
      // @ts-ignore
      this.videoElement.audioTracks
        ? // @ts-ignore
          Array.from(this.videoElement.audioTracks)
        : [];

    return internalTracks
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

  setSubtitleTrack(track?: Track) {
    const tracks = this.videoElement.textTracks || [];
    // if multiple tracks for one language exist, only set one
    // to be able to set captions/subtitles with the same language we need to check the kind as well
    let subtitleSet = false;
    Array.from(tracks)
      .filter((t) => SUPPORTED_TEXT_TRACK_KINDS.includes(t?.kind))
      .forEach((t) => {
        if (
          !subtitleSet &&
          t.language === track?.language &&
          t.kind === track?.kind
        ) {
          t.mode = "hidden";
          subtitleSet = true;
        } else {
          t.mode = "disabled";
        }
        if (!track && (t.kind as TTextKind) === "forced") {
          t.mode = "hidden";
          subtitleSet = true;
        }
      });
  }

  abstract getSubtitleTrack(): Track | undefined;

  abstract getSubtitleTracks(): Track[];

  /**
   * Helper methods for simpler cleanup of events
   */
  addVideoEventListener(type: string, listener: (evt: any) => void) {
    if (this.videoElement) {
      this.videoEventListeners.push({
        type,
        listener,
      });
      this.videoElement.addEventListener(type, listener as any);
    }
  }

  removeVideoEventListener(type: string, listener: (evt: any) => void) {
    const index = this.videoEventListeners.findIndex(
      (handler) => handler.type === type && handler.listener === listener
    );
    this.videoEventListeners.splice(index, 1);
    this.videoElement?.removeEventListener(type, listener as any);
  }

  removeVideoEventListeners() {
    if (this.videoElement) {
      this.videoEventListeners.forEach((evt) => {
        this.videoElement.removeEventListener(evt.type, evt.listener as any);
      });
      this.videoEventListeners = [];
    }
  }

  destroy() {
    this.removeVideoEventListeners();

    if (this.onTextTracksChangeReference) {
      this.videoElement.textTracks.removeEventListener(
        "change",
        this.onTextTracksChangeReference
      );
    }
    if (this.onAudioTrackChangeReference) {
      // @ts-ignore
      this.videoElement.audioTracks.removeEventListener(
        "change",
        this.onAudioTrackChangeReference
      );
    }
    if (this.mediaEventFilter) {
      this.mediaEventFilter.teardown();
    }

    this.stop();
    super.destroy();
  }
}
