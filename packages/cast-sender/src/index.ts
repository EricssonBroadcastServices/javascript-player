// SPDX-FileCopyrightText: 2024 Red Bee Media Ltd <https://www.redbeemedia.com/>
//
// SPDX-License-Identifier: MIT

import {
  AUTO_QUALITY_LEVEL_DEFINITION,
  BasePlayerState,
  CastSenderEvent,
  CastSenderEventMap,
  ContentType,
  Controller,
  DefaultPlayerState,
  EmitterBaseClass,
  ErrorTypes,
  IAdDataRepresentation,
  IAdsOptions,
  LogLevel,
  Logger,
  PlaybackState,
  PlayerError,
  Track,
  clamp,
  getLabel,
} from "@ericssonbroadcastservices/js-player-shared";

const logger = new Logger({
  prefix: "[Cast]",
});

const LOWEST_VOLUME = 0.01;
const HIGHEST_VOLUME = 1;

const DEFAULT_MEDIA_RECEIVER_APP_ID = "F40E2D17"; // Production - https://castreceiver.api.redbee.live/

function createTrack(track: chrome.cast.media.Track): Track {
  return {
    id: track.trackId,
    language: track.language,
    label: track.name || (track.language ? getLabel(track.language) : "-"),
  };
}

let castInitPromise: Promise<void> | undefined;
export function initializeCast(appId?: string) {
  return castInitPromise
    ? castInitPromise
    : (castInitPromise = new Promise<void>((resolve, reject) => {
        window["__onGCastApiAvailable"] = (isAvailable) => {
          if (isAvailable) {
            cast.framework.CastContext.getInstance().setOptions({
              receiverApplicationId: appId || DEFAULT_MEDIA_RECEIVER_APP_ID,
              autoJoinPolicy: chrome.cast.AutoJoinPolicy.ORIGIN_SCOPED,
            });
            resolve();
          } else {
            reject(new Error("[Cast] not available"));
          }
        };

        const castScript = document.createElement("script");
        castScript.src =
          "//www.gstatic.com/cv/js/sender/v1/cast_sender.js?loadCastFramework=1";
        document.body.appendChild(castScript);
      }));
}

type TCastBreak = {
  isWatched: boolean;
  position: number;
  breakClipIds: string[];
};

type TCastBreakClip = {
  id: string;
  duration: number;
};

// We can only create a single instance of the player & playerController
// subsequent creations of these will not receive events from the Cast SDK.
let player: cast.framework.RemotePlayer,
  playerController: cast.framework.RemotePlayerController;

export class CastSender
  extends EmitterBaseClass<CastSenderEventMap>
  implements Controller
{
  private state: BasePlayerState = { ...DefaultPlayerState };
  private lastContentId?: string;

  private session?: cast.framework.CastSession;
  private player?: cast.framework.RemotePlayer;
  private playerController?: cast.framework.RemotePlayerController;

  constructor({
    castAppId,
    logLevel,
  }: { castAppId?: string; logLevel?: LogLevel } = {}) {
    super();

    if (logLevel) {
      logger.setLogLevel(logLevel);
    }

    // bind `this` to event handlers
    this.onAnyChange = this.onAnyChange.bind(this);
    this.onSessionStateChanged = this.onSessionStateChanged.bind(this);
    this.onCastStateChanged = this.onCastStateChanged.bind(this);
    this.onTitleChanged = this.onTitleChanged.bind(this);
    this.onImageUrlChanged = this.onImageUrlChanged.bind(this);

    initializeCast(castAppId).then(
      () => {
        this.player = player = player || new cast.framework.RemotePlayer();
        this.playerController = playerController =
          playerController ||
          new cast.framework.RemotePlayerController(this.player);

        // Manually set state and dispatch events that we're connected
        // If the browser wasn't reloaded the framework won't automatically reconnect
        const context = cast.framework.CastContext.getInstance();
        this.onCastStateChanged({
          type: "",
          castState: context.getCastState(),
        });
        if (context.getCastState() === cast.framework.CastState.CONNECTED) {
          const session = context.getCurrentSession();
          if (session) {
            this.updateStateFromRemotePlayer();
            this.onConnected(session, true);
          }
        }

        this.setupListeners();
      },
      (err) => logger.warn(err)
    );
  }

  private setState(newState: Partial<BasePlayerState>) {
    const oldState = this.state;
    this.state = {
      ...oldState,
      ...newState,
    };
    this.emit(CastSenderEvent.STATE_CHANGE, this.state);
  }

  private getStateFromPlayerState(
    state: chrome.cast.media.PlayerState | null
  ): PlaybackState {
    switch (state) {
      case chrome.cast.media.PlayerState.BUFFERING:
        return PlaybackState.BUFFERING;
      case chrome.cast.media.PlayerState.PAUSED:
        return PlaybackState.PAUSED;
      case chrome.cast.media.PlayerState.PLAYING:
        return PlaybackState.PLAYING;
      case chrome.cast.media.PlayerState.IDLE:
      default:
        if (this.session && this.state.playbackState !== PlaybackState.IDLE) {
          return PlaybackState.ENDED;
        }
        return PlaybackState.IDLE;
    }
  }

  private onConnected(session: cast.framework.CastSession, isResumed: boolean) {
    this.session = session;
    this.emit(CastSenderEvent.CONNECTED, { isResumed });
    this.setState({
      isMuted: this.player?.isMuted,
    });
  }

  private onDisconnected() {
    this.session = undefined;
    this.emit(CastSenderEvent.DISCONNECTED, undefined);
    this.setState({
      playbackState: PlaybackState.IDLE,
    });
  }

  private getContentType(): ContentType {
    // @ts-ignore
    if (this.player?.isPlayingBreak) {
      return ContentType.AD;
    }
    if (this.player?.liveSeekableRange) {
      return ContentType.LIVE;
    }
    return ContentType.VOD;
  }

  getState() {
    return this.state;
  }

  isConnected() {
    return !!this.session;
  }

  isAvailable() {
    if (!window.cast) {
      return false;
    }
    return (
      cast.framework.CastContext.getInstance().getCastState() !==
      cast.framework.CastState.NO_DEVICES_AVAILABLE
    );
  }

  getContentId(): string | undefined {
    const mediaSession = this.session?.getMediaSession();
    if (mediaSession?.media?.contentId) {
      return mediaSession?.media?.contentId;
    }
    return this.lastContentId;
  }

  setupListeners() {
    const context = cast.framework.CastContext.getInstance();
    context.addEventListener(
      cast.framework.CastContextEventType.SESSION_STATE_CHANGED,
      this.onSessionStateChanged
    );

    context.addEventListener(
      cast.framework.CastContextEventType.CAST_STATE_CHANGED,
      this.onCastStateChanged
    );

    this.playerController?.addEventListener(
      cast.framework.RemotePlayerEventType.ANY_CHANGE,
      this.onAnyChange
    );

    this.playerController?.addEventListener(
      cast.framework.RemotePlayerEventType.TITLE_CHANGED,
      this.onTitleChanged
    );

    this.playerController?.addEventListener(
      cast.framework.RemotePlayerEventType.IMAGE_URL_CHANGED,
      this.onImageUrlChanged
    );
  }

  updateLastContentId() {
    const contentId = this.getContentId();
    if (contentId) {
      this.lastContentId = contentId;
    }
  }

  updateStateFromRemotePlayer() {
    if (!this.player) {
      return;
    }
    const {
      playerState,
      currentTime,
      duration,
      volumeLevel,
      isMuted,
      liveSeekableRange,
    } = this.player;

    const playbackState = this.getStateFromPlayerState(playerState);

    // @ts-ignore `startAbsoluteTime` is missing in the type definition
    const startTimeLive = this.player.mediaInfo?.startAbsoluteTime;

    const contentType = this.getContentType();

    let currentAd: IAdDataRepresentation | undefined;

    if (contentType === ContentType.AD) {
      currentAd = {
        // @ts-ignore breakClipId missing in types
        id: this.player.breakClipId,
        title: "",
        system: "",
        duration: -1,
        trackingEvents: {},
        clickThrough: "",
        // @ts-ignore currentBreakClipNumber missing in types
        adIndex: this.player.currentBreakClipNumber + 1,

        // @ts-ignore numberBreakClips missing in types
        adsTotal: this.player.numberBreakClips,
      };
    }

    this.setState({
      isLive: !!liveSeekableRange,
      contentType,
      currentTime,
      currentAd,
      utcCurrentTime: startTimeLive ? startTimeLive + currentTime * 1000 : 0,
      duration,
      utcDuration: startTimeLive ? startTimeLive + duration : 0,
      seekable: {
        start: liveSeekableRange?.start ?? 0,
        end: liveSeekableRange?.end ?? duration,
      },
      playbackState,
      hasStarted:
        !this.state.hasStarted && playbackState === PlaybackState.PLAYING
          ? true
          : this.state.hasStarted,
      volume: volumeLevel,
      isMuted,
      adMarkers: this.getAdMarkers(),
      audioTrack: this.getAudioTrack(),
      audioTracks: this.getAudioTracks(),
      subtitleTrack: this.getSubtitleTrack(),
      subtitleTracks: this.getSubtitleTracks(),
      isSeekable: this.player.canSeek,
      isAtLiveEdge:
        liveSeekableRange?.end !== undefined
          ? currentTime > liveSeekableRange.end - 30
          : false,
    });
  }

  private getTrackById(trackId: number) {
    return this.session
      ?.getMediaSession()
      ?.media?.tracks?.find((track) => track.trackId === trackId);
  }

  private getActiveTrackIds(): number[] {
    return this.session?.getMediaSession()?.activeTrackIds ?? [];
  }

  private getActiveAudioTrack(): chrome.cast.media.Track | undefined {
    const mediaSession = this.session?.getMediaSession();
    if (mediaSession) {
      return this.getInternalAudioTracks().find((track) =>
        mediaSession.activeTrackIds?.includes(track.trackId)
      );
    }
  }

  private getAudioTrackById(id: string | number) {
    return this.getInternalAudioTracks().find(
      (track) => track.trackId === Number(id)
    );
  }

  private getInternalAudioTracks(): chrome.cast.media.Track[] {
    return (
      this.player?.mediaInfo?.tracks?.filter(
        (track: chrome.cast.media.Track) =>
          track.type === chrome.cast.media.TrackType.AUDIO
      ) ?? []
    );
  }

  private getActiveTextTrack(): chrome.cast.media.Track | undefined {
    const mediaSession = this.session?.getMediaSession();
    if (mediaSession) {
      return this.getTextTracks().find((track) =>
        mediaSession.activeTrackIds?.includes(track.trackId)
      );
    }
  }

  private getTextTrackById(id: string | number) {
    return this.getTextTracks().find((track) => track.trackId === Number(id));
  }

  private getTextTracks(): chrome.cast.media.Track[] {
    return (
      this.player?.mediaInfo?.tracks?.filter(
        (track: chrome.cast.media.Track) =>
          track.type === chrome.cast.media.TrackType.TEXT
      ) ?? []
    );
  }

  private getAdMarkers() {
    // breaks and breakClips doesn't exist in the type definition
    const mediaInfo = this.session?.getMediaSession()?.media as any;
    const breaks: TCastBreak[] = mediaInfo?.breaks;
    const breakClips: TCastBreakClip[] = mediaInfo?.breakClips;

    return (
      breaks?.map((adBreak) => ({
        startTime: adBreak.position,
        watched: adBreak.isWatched,
        duration: adBreak.breakClipIds
          .map((id) => {
            const breakClip = breakClips.find(
              (breakClip) => breakClip.id === id
            );
            return breakClip?.duration ?? 0;
          })
          .reduce((duration, clipDuration) => duration + clipDuration, 0),
      })) ?? []
    );
  }

  onCastStateChanged({ castState }: cast.framework.CastStateEventData) {
    if (castState === cast.framework.CastState.NO_DEVICES_AVAILABLE) {
      this.emit(CastSenderEvent.AVAILABILITY_CHANGED, {
        available: false,
      });
    } else {
      this.emit(CastSenderEvent.AVAILABILITY_CHANGED, {
        available: true,
      });
    }
  }

  onSessionStateChanged({
    session,
    sessionState,
  }: cast.framework.SessionStateEventData) {
    switch (sessionState) {
      case cast.framework.SessionState.SESSION_STARTED:
      case cast.framework.SessionState.SESSION_RESUMED: {
        const isResumed =
          sessionState === cast.framework.SessionState.SESSION_RESUMED;
        this.onConnected(session, isResumed);
        break;
      }
      case cast.framework.SessionState.SESSION_ENDED:
        this.onDisconnected();
        break;
    }
  }

  onAnyChange() {
    this.updateLastContentId();
    this.updateStateFromRemotePlayer();
  }

  onTitleChanged(evt: any) {
    this.emit(CastSenderEvent.METADATA_UPDATE, {
      title: evt.value,
      imageUrl: this.player?.imageUrl ?? undefined,
    });
  }

  onImageUrlChanged(evt: any) {
    this.emit(CastSenderEvent.METADATA_UPDATE, {
      title: this.player?.title,
      imageUrl: evt.value,
    });
  }

  load({
    source,
    audioLanguage,
    subtitleLanguage,
    startTime,
    customer,
    businessUnit,
    sessionToken,
    adobePrimetimeToken,
    locale,
    exposureBaseUrl,
    adParameters,
  }: {
    source: string;
    customer: string;
    businessUnit: string;
    sessionToken: string;
    adobePrimetimeToken?: string;
    locale: string;
    exposureBaseUrl: string;
    adParameters?: IAdsOptions;
    audioLanguage?: string;
    subtitleLanguage?: string;
    startTime?: number;
  }) {
    const mediaInfo = new chrome.cast.media.MediaInfo(source, "");
    const isAsset = !source.includes("://");
    if (!isAsset) {
      Object.assign(mediaInfo, { contentUrl: source });
    }
    const request = new chrome.cast.media.LoadRequest(mediaInfo);

    if (startTime) {
      request.currentTime = startTime;
    }

    request.customData = {
      customer,
      businessUnit,
      audioLanguage,
      subtitleLanguage,
      locale,
    };

    if (isAsset) {
      Object.assign(request, { credentials: sessionToken });
      Object.assign(request.customData, {
        exposureBaseUrl,
        adParameters,
        adobePrimetimeToken,
      });
    }

    return this.loadRequest(request);
  }

  private async loadRequest(
    request: chrome.cast.media.LoadRequest
  ): Promise<void | chrome.cast.ErrorCode> {
    const castSession =
      cast.framework.CastContext.getInstance().getCurrentSession();

    if (!castSession) {
      const err = new PlayerError("Failed to create cast session", {
        type: ErrorTypes.CAST,
      });
      return Promise.reject(err);
    }

    return castSession.loadMedia(request).catch((err) => {
      if (err === "timeout") {
        // ignore timeout since that can happen even if everything is working fine
        return;
      }
      logger.error("[CastSender]", err);
      this.emit(
        CastSenderEvent.ERROR,
        new PlayerError(`Failed to load media: ${err}`, {
          type: ErrorTypes.CAST,
          rawError: err,
        })
      );
    });
  }

  isPlaying() {
    return this.state.playbackState === PlaybackState.PLAYING;
  }

  isLive() {
    return this.state.isLive;
  }

  isVolumeReadOnly() {
    return Promise.resolve(false);
  }

  play() {
    if (this.player?.isPaused) {
      this.playerController?.playOrPause();
    }
    return Promise.resolve();
  }

  pause() {
    if (!this.player?.isPaused) {
      this.playerController?.playOrPause();
    }
  }

  stop() {
    this.session?.endSession(true);
  }

  mute() {
    if (this.player && this.playerController && !this.player.isMuted) {
      this.playerController.muteOrUnmute();
    }
  }

  unmute() {
    if (this.player && this.playerController && this.player.isMuted) {
      this.playerController.muteOrUnmute();
    }
  }

  getCurrentTime() {
    return this.state.currentTime;
  }

  getDuration() {
    return this.state.duration;
  }

  getUTCCurrentTime() {
    return this.state.utcCurrentTime;
  }

  getUTCDuration() {
    return this.state.utcDuration;
  }

  getSeekable() {
    if (this.player?.liveSeekableRange) {
      return {
        start: this.player.liveSeekableRange.start ?? 0,
        end: this.player.liveSeekableRange.end ?? 0,
      };
    }
    return {
      start: 0,
      end: this.player?.duration ?? 0,
    };
  }

  scrub(change: number) {
    if (!this.player?.canSeek) {
      return;
    }
    this.seekTo(this.player.currentTime + change);
  }

  seekTo(time: number) {
    if (!this.player?.canSeek || !this.playerController) {
      return;
    }
    // TODO: Remove this!
    // This is a workaround for a bug in the cast sdk where the SEEKING event is not fired if time is equal to 0
    if (time === 0) {
      time = 0.001;
    }
    this.player.currentTime = time;
    this.playerController.seek();
  }

  seekToLive() {
    if (
      this.playerController &&
      this.player?.liveSeekableRange?.end !== undefined
    ) {
      this.player.currentTime = this.player.liveSeekableRange.end;
      this.playerController.seek();
    }
  }

  setAudioTrack(track: Track) {
    const internalTrack = this.getAudioTrackById(track.id);
    if (!internalTrack) {
      return;
    }

    const media = this.session?.getMediaSession();
    const activeTrackIds = this.getActiveTrackIds();
    const tracksInfoRequest = new chrome.cast.media.EditTracksInfoRequest(
      activeTrackIds.map((id) => {
        if (this.getTrackById(id)?.type === chrome.cast.media.TrackType.AUDIO) {
          return internalTrack.trackId;
        }
        return id;
      })
    );
    media?.editTracksInfo(
      tracksInfoRequest,
      () => {
        /* no-op*/
      },
      () => {
        /* no-op*/
      }
    );
  }

  getAudioTrack(): Track | undefined {
    const track = this.getActiveAudioTrack();
    if (track) {
      return createTrack(track);
    }
  }

  getAudioTracks(): Track[] {
    return this.getInternalAudioTracks().map((track) => createTrack(track));
  }

  setSubtitleTrack(track?: Track) {
    const mediaSession = this.session?.getMediaSession();
    if (!mediaSession) {
      return;
    }

    let activeTrackIds = this.getActiveTrackIds();
    if (track) {
      const internalTrack = this.getTextTrackById(track.id);
      if (!internalTrack) {
        return;
      }

      if (this.getActiveTextTrack()) {
        activeTrackIds = activeTrackIds.map((id) => {
          if (
            this.getTrackById(id)?.type === chrome.cast.media.TrackType.TEXT
          ) {
            return internalTrack.trackId;
          }
          return id;
        });
      } else {
        activeTrackIds.push(internalTrack.trackId);
      }
      const tracksInfoRequest = new chrome.cast.media.EditTracksInfoRequest(
        activeTrackIds
      );
      mediaSession.editTracksInfo(
        tracksInfoRequest,
        () => {
          /* no-op*/
        },
        () => {
          /* no-op*/
        }
      );
    } else {
      const tracksInfoRequest = new chrome.cast.media.EditTracksInfoRequest(
        activeTrackIds.filter(
          (id) =>
            this.getTrackById(id)?.type !== chrome.cast.media.TrackType.TEXT
        )
      );
      mediaSession.editTracksInfo(
        tracksInfoRequest,
        () => {
          /* no-op*/
        },
        () => {
          /* no-op*/
        }
      );
    }
  }

  getSubtitleTrack(): Track | undefined {
    const track = this.getActiveTextTrack();
    if (track) {
      return createTrack(track);
    }
  }

  getSubtitleTracks(): Track[] {
    return this.getTextTracks().map((track) => createTrack(track)) ?? [];
  }

  setQualityLevel() {
    /* no-op */
  }

  getQualityLevel() {
    return AUTO_QUALITY_LEVEL_DEFINITION;
  }

  getQualityLevels() {
    return [AUTO_QUALITY_LEVEL_DEFINITION];
  }

  getVolume(): number | undefined {
    return this.player?.volumeLevel;
  }

  setVolume({ percentage, change }: { percentage?: number; change?: number }) {
    if (!this.player) {
      return;
    }

    let volume = this.getVolume();
    if (volume === undefined) {
      return;
    }

    if (percentage && !change) {
      volume = clamp(percentage / 100, LOWEST_VOLUME, HIGHEST_VOLUME);
    }
    if (!percentage && change) {
      const currentVolume = volume * 100;
      const newVolume = currentVolume + change;
      volume = clamp(newVolume / 100, LOWEST_VOLUME, HIGHEST_VOLUME);
    }
    this.player.volumeLevel = volume;
    this.playerController?.setVolumeLevel();
  }

  setMuted(muted: boolean): void {
    if (this.playerController && this.player?.isMuted !== muted) {
      this.playerController.muteOrUnmute();
    }
  }

  toggleMuted() {
    this.playerController?.muteOrUnmute();
  }

  destroy({
    retainCastSession = false,
  }: {
    retainCastSession?: boolean;
  } = {}): void {
    if (window.cast) {
      const context = cast.framework.CastContext.getInstance();
      context.removeEventListener(
        cast.framework.CastContextEventType.SESSION_STATE_CHANGED,
        this.onSessionStateChanged
      );

      context.removeEventListener(
        cast.framework.CastContextEventType.CAST_STATE_CHANGED,
        this.onCastStateChanged
      );

      this.playerController?.removeEventListener(
        cast.framework.RemotePlayerEventType.ANY_CHANGE,
        this.onAnyChange
      );
      if (retainCastSession === false) {
        context.endCurrentSession(true);
      }
    }
    super.destroy();
  }
}
