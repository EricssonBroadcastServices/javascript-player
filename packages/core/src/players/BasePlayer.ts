// SPDX-FileCopyrightText: 2024 Red Bee Media Ltd <https://www.redbeemedia.com/>
//
// SPDX-License-Identifier: MIT

import {
  DRMLicense,
  MediaFormatType,
} from "@ericssonbroadcastservices/rbm-ott-sdk";

import {
  AUTO_QUALITY_LEVEL_DEFINITION,
  BasePlayerState,
  ErrorTypes,
  InitError,
  PlaybackState,
  PlayerEvents,
  QualityLevel,
  Track,
  clamp,
  debounce,
} from "@ericssonbroadcastservices/js-player-shared";

import {
  AbstractBaseEngine,
  SUPPORTED_TEXT_TRACK_KINDS,
} from "../engines/AbstractBaseEngine";
import { DashJs } from "../engines/DashJs";
import { HlsJs } from "../engines/HlsJs";
import {
  BitrateChangedEngineEvent,
  DrmUpdateEngineEvent,
  EngineEvents,
  MetadataEngineEvent,
  SubtitleCueChangeEngineEvent,
  TrackChangedEngineEvent,
  TracksChangedEngineEvent,
  VolumeChangeEngineEvent,
} from "../engines/interfaces";
import { Native } from "../engines/Native";
import { Shaka } from "../engines/Shaka";
import { MIN_DVR_WINDOW } from "../utils/defaults";
import { isNativeHlsSupported } from "../utils/helpers";
import {
  AudioIdentifier,
  InstanceSettingsInterface,
  TextIdentifier,
} from "../utils/interfaces";
import { getPreferences, setPreferences } from "../utils/preferences";
import { AbstractPlayer, IPlayerStreamInfo } from "./AbstractPlayer";

const LOWEST_VOLUME = 0.01;
const HIGHEST_VOLUME = 1;

export class BasePlayer extends AbstractPlayer {
  private debounceSeekTo: any;
  protected playerEngine: AbstractBaseEngine;

  private startTime?: number;
  protected mediaLocator?: string;
  protected playbackFormat?: MediaFormatType;
  protected license?: DRMLicense;

  private scrubChange = 0;
  private isFakePaused = false;
  private debouncedSeek = false;

  private destroyed = false;

  constructor(
    protected videoElement: HTMLVideoElement,
    protected subtitleContainer: HTMLDivElement,
    instanceSettings: InstanceSettingsInterface,
    private source?: string,
    initialState: Partial<BasePlayerState> = {}
  ) {
    super(instanceSettings, {
      ...initialState,
      isMuted: instanceSettings.initOptions.muted,
      volume: videoElement.volume,
    });

    this.setupDebounceSeekTo();

    this.playerEngine = this.getPlayerEngine();

    const { muted } = this.instanceSettings.initOptions;

    if (muted !== undefined) {
      this.setMuted(muted);
    }

    this.setupPlayerEngineEventListeners();
  }

  setupPlayerEngineEventListeners() {
    this.playerEngine.on(EngineEvents.DRM_UPDATE, this.onDrmUpdate.bind(this));
    this.playerEngine.on(EngineEvents.LOADED, this.onLoaded.bind(this));
    this.playerEngine.on(EngineEvents.PLAY, this.onPlay.bind(this));
    this.playerEngine.on(EngineEvents.PLAYING, this.onPlaying.bind(this));
    this.playerEngine.on(EngineEvents.PAUSE, this.onPause.bind(this));
    this.playerEngine.on(
      EngineEvents.TIME_UPDATE,
      this.onTimeUpdate.bind(this)
    );
    this.playerEngine.on(EngineEvents.SEEKING, this.onSeeking.bind(this));
    this.playerEngine.on(EngineEvents.SEEKED, this.onSeeked.bind(this));
    this.playerEngine.on(EngineEvents.BUFFERING, this.onBuffering.bind(this));
    this.playerEngine.on(EngineEvents.BUFFERED, this.onBuffered.bind(this));
    this.playerEngine.on(
      EngineEvents.DROPPED_FRAMES,
      this.onDroppedFrames.bind(this)
    );
    this.playerEngine.on(
      EngineEvents.SUBTITLE_CHANGED,
      this.onSubtitleChanged.bind(this)
    );
    this.playerEngine.on(
      EngineEvents.AUDIO_CHANGED,
      this.onAudioChanged.bind(this)
    );
    this.playerEngine.on(
      EngineEvents.VOLUME_CHANGE,
      this.onVolumeChanged.bind(this)
    );
    this.playerEngine.on(
      EngineEvents.BITRATE_CHANGED,
      this.onBitrateChanged.bind(this)
    );
    this.playerEngine.on(EngineEvents.ENDED, this.onEnded.bind(this));
    this.playerEngine.on(EngineEvents.ERROR, this.onError.bind(this));
    this.playerEngine.on(
      EngineEvents.STATE_CHANGED,
      this.onEngineStateChange.bind(this)
    );
    this.playerEngine.on(
      EngineEvents.TRACKS_CHANGED,
      this.onTracksChanged.bind(this)
    );
    this.playerEngine.on(
      EngineEvents.SUBTITLE_CUE_CHANGED,
      this.onSubtitleCueChanged.bind(this)
    );
    this.playerEngine.on(
      EngineEvents.METADATA_EVENT,
      this.onMetadataChanged.bind(this)
    );
  }

  /**
   * Get the preferred audio & text langauges for media playback.
   * Uses the stored user preferences.
   */
  protected getPreferredLanguages(): {
    audio?: AudioIdentifier;
    subtitle?: TextIdentifier;
  } {
    const { audio, subtitle } = getPreferences();
    return { audio, subtitle };
  }

  load(startTime?: number) {
    if (!this.mediaLocator) {
      return Promise.reject(
        new InitError(
          `Missing properties: playerEngine: ${this.playerEngine} or mediaLocator: ${this.mediaLocator}`,
          { type: ErrorTypes.GENERIC }
        )
      );
    }
    this.startTime = startTime;
    const languages = this.getPreferredLanguages();

    this.playerEngine.load({
      src: this.mediaLocator,
      license: this.license,
      startTime,
      audio: languages.audio,
      subtitle: languages.subtitle,
    });
  }

  /**
   * ONLY AVAILABLE DURING DEVELOPMENT
   * `getPlayerEngine()` calls this method if the property is set, allows
   * developers to select which engine they want to use for a particular session.
   */
  getPlayerEngineDev(): AbstractBaseEngine | undefined {
    if (process.env.NODE_ENV === "development") {
      if (window.__RED_BEE_MEDIA__?.engine) {
        switch (window.__RED_BEE_MEDIA__.engine) {
          case "shaka":
            return new Shaka(this.videoElement, this.instanceSettings);
          case "dashjs":
            return new DashJs(this.videoElement, this.instanceSettings);
          case "hlsjs":
            return new HlsJs(this.videoElement, this.instanceSettings);
          case "native":
            return new Native(this.videoElement, this.instanceSettings);
        }
      }
    }
  }

  getPlayerEngine(): AbstractBaseEngine {
    this.mediaLocator = this.source;
    if (process.env.NODE_ENV === "development") {
      const devEngine = this.getPlayerEngineDev();
      if (devEngine) {
        return devEngine;
      }
    }
    if (this.mediaLocator?.includes(".m3u8")) {
      this.playbackFormat = "HLS";
      if (isNativeHlsSupported()) {
        return new Native(this.videoElement, this.instanceSettings);
      }
      return new HlsJs(this.videoElement, this.instanceSettings);
    } else if (this.mediaLocator?.includes(".mpd")) {
      this.playbackFormat = "DASH";
      return new Shaka(this.videoElement, this.instanceSettings);
    }
    if (
      this.mediaLocator?.includes("ism") ||
      this.mediaLocator?.includes("Manifest")
    ) {
      this.playbackFormat = "SMOOTHSTREAMING";
      return new DashJs(this.videoElement, this.instanceSettings);
    }
    return new Native(this.videoElement, this.instanceSettings);
  }

  getPlayerEngineName() {
    return this.playerEngine.name;
  }

  getPlayerEngineVersion() {
    return this.playerEngine.playertechVersion;
  }

  getPlaybackFormat(): MediaFormatType | undefined {
    return this.playbackFormat;
  }

  isLive() {
    return this.playerEngine ? this.playerEngine.isLive() : super.isLive();
  }

  isSeekable() {
    const seekable = this.playerEngine.getSeekable() ?? { start: 0, end: 0 };
    return this.playerEngine.isLive()
      ? seekable.end - seekable.start > MIN_DVR_WINDOW
      : seekable.end - seekable.start > 0;
  }

  play() {
    if (this.playerEngine && this.state.playbackState !== PlaybackState.IDLE) {
      return this.playerEngine.play();
    }
  }

  pause() {
    this.playerEngine.pause();
  }

  stop() {
    this.playerEngine.stop();
    this.emit(PlayerEvents.STOP, this.getDefaultPlayerEvent());
  }

  setupDebounceSeekTo() {
    if (!this.debounceSeekTo) {
      this.debounceSeekTo = debounce((time: number) => {
        this.scrubChange = 0;
        this.debouncedSeek = true;
        this.seekTo(time);
        if (this.isFakePaused) {
          this.play();
          this.isFakePaused = false;
        }
      }, 500);
    }
  }

  scrub(change: number) {
    if (!this.isSeekable()) {
      return;
    }
    const seekable = this.getSeekable();
    const currentTime = this.getCurrentTime();
    const duration = this.getDuration();

    this.scrubChange += change;
    const time = clamp(
      currentTime + this.scrubChange,
      seekable.start,
      duration
    );
    // Set the playbackState manually to Seeking thus overriding the engine playbackState
    this.setState({ playbackState: PlaybackState.SEEKING });
    this.onSeeking();
    this.debounceSeekTo(time);
    this.onSeekTimeChange(time);

    if (this.isPlaying()) {
      if (!this.isFakePaused) {
        this.isFakePaused = true;
        this.pause();
      }
    }
  }

  seekTo(time: number) {
    if (!this.isSeekable()) {
      return;
    }
    this.playerEngine.seekTo(time);
  }

  seekToLive() {
    if (this.playerEngine.isAtLiveEdge()) {
      return;
    }
    return this.playerEngine.seekToLive();
  }

  setPlaybackRate(rate: number) {
    return this.playerEngine.setPlaybackRate(rate);
  }

  setVolume({ percentage, change }: { percentage?: number; change?: number }) {
    let volume = 1;
    if (percentage && !change) {
      volume = clamp(percentage / 100, LOWEST_VOLUME, HIGHEST_VOLUME);
    }
    if (!percentage && change) {
      const currentVolume = this.playerEngine.getVolume() * 100;
      const newVolume = currentVolume + change;
      volume = clamp(newVolume / 100, LOWEST_VOLUME, HIGHEST_VOLUME);
    }
    this.playerEngine.setVolume(volume);
  }

  public getVolume() {
    return this.playerEngine.getVolume() ?? 0;
  }

  toggleMuted() {
    this.playerEngine.toggleMuted();
  }

  setMuted(muted: boolean) {
    this.playerEngine.setMuted(muted);
  }

  isPlaying() {
    return this.playerEngine.isPlaying() ?? false;
  }

  getCurrentTime() {
    return this.playerEngine.getCurrentTime() ?? 0;
  }

  getDuration() {
    return this.playerEngine.getDuration() ?? 0;
  }

  getSeekable() {
    return this.playerEngine.getSeekable() ?? { start: 0, end: 0 };
  }

  getUTCCurrentTime() {
    return this.playerEngine.getUTCCurrentTime() ?? 0;
  }

  getUTCDuration() {
    return this.playerEngine.getUTCDuration() ?? 0;
  }

  getUTCSeekable() {
    return this.playerEngine.getUTCSeekable() ?? { start: 0, end: 0 };
  }
  getContentMarkers() {
    return this.getState().contentMarkers;
  }

  setQualityLevel(level: QualityLevel) {
    this.playerEngine.setQualityLevel(level);
    this.setState({ qualityLevel: level });
  }

  getQualityLevels(): QualityLevel[] {
    return this.playerEngine
      .getQualityLevels()
      .sort((a, b) => a.bandwidth - b.bandwidth);
  }

  getQualityLevel(): QualityLevel {
    if (this.playerEngine) {
      return this.playerEngine.getQualityLevel();
    }
    return AUTO_QUALITY_LEVEL_DEFINITION;
  }

  setAudioTrack(track: Track) {
    if (this.playerEngine) {
      this.playerEngine.setAudioTrack(track);
      this.setState({ qualityLevels: this.getQualityLevels() });
    }
  }

  getAudioTrack(): Track | undefined {
    if (this.playerEngine) {
      return this.playerEngine.getAudioTrack();
    }
  }

  getAudioTracks(): Track[] {
    if (this.playerEngine) {
      return this.playerEngine.getAudioTracks();
    }
    return [];
  }

  setSubtitleTrack(track?: Track) {
    if (this.playerEngine) {
      this.playerEngine.setSubtitleTrack(track);
    }
  }

  getSubtitleTrack(): Track | undefined {
    if (this.playerEngine) {
      return this.playerEngine.getSubtitleTrack();
    }
  }

  getSubtitleTracks(): Track[] {
    if (this.playerEngine) {
      return this.playerEngine.getSubtitleTracks();
    }
    return [];
  }

  clickThrough(): void {
    if (this.isPlaying()) {
      this.pause();
    } else {
      this.play();
    }
  }

  setState(state: Partial<BasePlayerState>, emit?: boolean, force = false) {
    if (!this.isFakePaused || force) {
      // if we're changing the seekable state we must also update the engines client restrictions.
      if ("isSeekable" in state) {
        this.playerEngine.setClientRestrictions({
          timeshiftEnabled: state.isSeekable,
        });
      }
      super.setState(state, emit);
    }
  }

  onEngineStateChange(playbackState: PlaybackState) {
    if (!this.isFakePaused) {
      this.setState({ playbackState });
    }
  }

  onPlaying() {
    if (!this.state.hasStarted) {
      this.onPlay();
    } else {
      this.emit(PlayerEvents.PLAYING, this.getDefaultPlayerEvent());
    }
  }

  onDrmUpdate(type: DrmUpdateEngineEvent) {
    this.emit(PlayerEvents.DRM_UPDATE, {
      ...this.getDefaultPlayerEvent(),
      type,
    });
  }

  onLoaded() {
    if (!this.state.hasStarted) {
      this.emit(PlayerEvents.LOADED, {
        ...this.getDefaultPlayerEvent(),
        startTime: this.startTime,
        playSessionId: this.instanceSettings.playResponse?.playSessionId,
      });
      this.setState({
        currentTime: this.getCurrentTime(),
        duration: this.getDuration(),
        seekable: this.getSeekable(),

        utcCurrentTime: this.getUTCCurrentTime(),
        utcDuration: this.getUTCDuration(),
        utcSeekable: this.getUTCSeekable(),

        qualityLevel: this.getQualityLevel(),
        qualityLevels: this.getQualityLevels(),

        isLive: this.isLive(),
        isSeekable: this.isSeekable(),
      });
    }
  }

  onPlay() {
    if (this.state.hasStarted) {
      if (this.isLive() && !this.state.isSeekable) {
        // force enable timeshiftEnabled temporarily to allow
        // seekToLive to function.
        this.playerEngine.setClientRestrictions({
          timeshiftEnabled: true,
        });
        this.seekToLive();
      }
      this.emit(PlayerEvents.RESUME, this.getDefaultPlayerEvent());
    } else {
      const qualityLevel = this.getQualityLevel();
      this.emit(PlayerEvents.START, {
        ...this.getDefaultPlayerEvent(),
        playSessionId: this.instanceSettings.playResponse?.playSessionId,
        startTime: this.startTime,
        source: this.mediaLocator ?? "",
        bitrate: qualityLevel.bandwidth,
        qualityLevel,
        qualityLevels: this.getQualityLevels(),
      });
      this.setState({
        hasStarted: true,
      });
    }
  }

  onPause() {
    if (!this.isFakePaused && this.state.hasStarted) {
      this.emit(PlayerEvents.PAUSE, this.getDefaultPlayerEvent());
    }
  }

  onMetadataChanged(data: MetadataEngineEvent) {
    this.emit(PlayerEvents.METADATA_EVENT, {
      ...this.getDefaultPlayerEvent(),
      ...data,
    });
  }

  onTimeUpdate() {
    if (this.state.hasStarted) {
      this.emit(PlayerEvents.TIME_UPDATE, this.getDefaultPlayerEvent());

      const seekable = this.getSeekable();

      this.setState({
        currentTime: this.getCurrentTime(),
        duration: this.getDuration(),
        seekable,

        utcCurrentTime: this.getUTCCurrentTime(),
        utcDuration: this.getUTCDuration(),
        utcSeekable: this.getUTCSeekable(),

        isMuted: this.videoElement.muted,
        isLive: this.playerEngine.isLive(),
        isSeekable: this.isSeekable(),
        isAtLiveEdge: !this.isSeekable() || this.playerEngine.isAtLiveEdge(),
      });
    }
  }

  onSeeking() {
    if (this.debouncedSeek) {
      // when debounceSeeking the seeking event has been manually dispatched
      this.debouncedSeek = false;
    } else {
      this.emit(PlayerEvents.SEEKING, this.getDefaultPlayerEvent());
    }
    this.setState({
      currentTime: this.getCurrentTime(),
      utcCurrentTime: this.getUTCCurrentTime(),
    });
  }

  onSeekTimeChange(time: number) {
    this.emit(PlayerEvents.SEEK_TIME_CHANGE, {
      ...this.getDefaultPlayerEvent(),
      currentTime: time,
      utcCurrentTime: this.getUTCCurrentTime(),
    });
    this.setState(
      {
        currentTime: time,
        utcCurrentTime: this.getUTCCurrentTime(),
      },
      true,
      true
    );
  }

  onSeeked() {
    this.scrubChange = 0;
    this.emit(PlayerEvents.SEEKED, this.getDefaultPlayerEvent());
    this.setState({
      currentTime: this.getCurrentTime(),
      utcCurrentTime: this.getUTCCurrentTime(),
    });
  }

  onBuffering() {
    if (this.state.hasStarted) {
      this.emit(PlayerEvents.BUFFERING, this.getDefaultPlayerEvent());
      const bufferingEvents = (this.state.bufferingEvents || 0) + 1;
      this.setState({ bufferingEvents });
    }
  }

  onBuffered() {
    this.emit(PlayerEvents.BUFFERED, this.getDefaultPlayerEvent());
  }

  onDroppedFrames(totalDroppedFrames: number): void {
    this.emit(PlayerEvents.DROPPED_FRAMES, {
      ...this.getDefaultPlayerEvent(),
      droppedFrames: totalDroppedFrames,
    });
    this.setState({ droppedFrames: totalDroppedFrames });
  }

  onSubtitleChanged(data: TrackChangedEngineEvent) {
    if (this.state.hasStarted) {
      this.emit(PlayerEvents.SUBTITLE_CHANGED, {
        ...this.getDefaultPlayerEvent(),
        track: data.track,
      });
    }
    this.setState({
      subtitleTrack: this.getSubtitleTrack(),
      subtitleTracks: this.getSubtitleTracks(),
    });
    // This check is needed so that we don't save a 'metadata' track as preferred subtitle/kind
    if (
      data.shouldUpdatePreferences &&
      (!data.track?.kind ||
        SUPPORTED_TEXT_TRACK_KINDS.includes(data.track.kind))
    ) {
      setPreferences({
        subtitle: {
          language: data.track?.language,
          kind: data.track?.kind,
        },
      });
    }
  }

  onSubtitleCueChanged(cues: SubtitleCueChangeEngineEvent) {
    this.subtitleContainer.innerHTML = "";
    cues.forEach((cue) => {
      const node = cue.getCueAsHTML();
      // cueContainer is for positioning
      const cueContainer = document.createElement("div");
      cueContainer.className = "redbee-player-subtitle-cue-container";
      // cueElement is for SDK customers applying custom styles
      const cueElement = document.createElement("span");
      cueElement.className = "redbee-player-subtitle-cue";
      cueContainer.appendChild(cueElement);

      this.positionCue(cue, cueContainer.style);

      if (node) {
        cueElement.appendChild(node);
      }

      this.subtitleContainer.appendChild(cueContainer);
    });
  }

  onAudioChanged(data: TrackChangedEngineEvent) {
    if (this.state.hasStarted) {
      this.emit(PlayerEvents.AUDIO_CHANGED, {
        ...this.getDefaultPlayerEvent(),
        ...data,
      });
    }
    this.setState({
      audioTrack: data.track,
      audioTracks: this.getAudioTracks(),
    });
    setPreferences({
      audio: {
        language: data.track?.language,
        kind: data.track?.kind,
      },
    });
  }

  onTracksChanged({
    audioTrack,
    subtitleTrack,
    audioTracks,
    subtitleTracks,
  }: TracksChangedEngineEvent) {
    this.setState({
      audioTrack,
      subtitleTrack,
      subtitleTracks,
      audioTracks,
    });
  }

  onVolumeChanged({ volume, muted }: VolumeChangeEngineEvent) {
    this.emit(PlayerEvents.VOLUME_CHANGE, {
      ...this.getDefaultPlayerEvent(),
      volume,
      muted,
    });
    this.setState({ volume, isMuted: muted });
  }

  onBitrateChanged(data: BitrateChangedEngineEvent) {
    this.emit(PlayerEvents.BITRATE_CHANGED, data);
  }

  onEnded() {
    this.setState({ isSeekable: this.isSeekable() });
    this.emit(PlayerEvents.ENDED, this.getDefaultPlayerEvent());
  }

  onError(data: any) {
    if (this.destroyed) {
      return;
    }
    this.emit(PlayerEvents.ERROR, data);
  }

  positionCue(cue: VTTCue, style: CSSStyleDeclaration) {
    // Cue positioning
    // References: https://w3c.github.io/webvtt/ and https://www.speechpad.com/captions/webvtt
    // Current implementation doesn't support "vertical", "lineAlign" and "positionAlign"
    const transforms: string[] = [];

    // Size is the width of the cue box
    if (cue.size && cue.size !== 100) {
      style.width = `${cue.size}%`;
    }

    // Align can be: start|left|center|middle|right|end and affects positioning
    if (["start", "left"].includes(cue.align)) {
      style.textAlign = "left";
      if (Number.isFinite(cue.position)) {
        style.left = `${cue.position}%`;
      }
    } else if (["right", "end"].includes(cue.align)) {
      style.textAlign = "right";
      if (Number.isFinite(cue.position)) {
        style.right = `${100 - (cue.position as number)}%`;
      } else {
        style.right = "0";
      }
    } else {
      Object.assign(style, {
        textAlign: "center",
        left: "0",
        right: "0",
      });

      // When centered "position" 0% means left, 100% means right and 50% middle
      if (Number.isFinite(cue.position)) {
        transforms.push(`translateX(${(cue.position as number) - 50}%)`);
      }
    }

    if (cue.line === "auto") {
      style.bottom = "0";
    } else if (Number.isFinite(cue.line)) {
      const line = cue.line as number;
      if (cue.snapToLines) {
        if (cue.line < 0) {
          style.bottom = "-1em";
        }
        transforms.push(`translateY(${line * 100}%)`);
      } else {
        style.top = `${cue.line}%`;
      }
    }

    if (transforms.length) {
      style.transform = transforms.join(" ");
    }
  }

  public getStreamInfo(): IPlayerStreamInfo | undefined {
    if (!this.mediaLocator || !this.playbackFormat) return;
    return {
      mediaLocator: this.mediaLocator,
      format: this.playbackFormat,
      hasDrm: !!this.license,
    };
  }

  public destroy() {
    this.destroyed = true;
    this.stop();
    this.playerEngine.destroy();
    super.destroy();
  }
}
