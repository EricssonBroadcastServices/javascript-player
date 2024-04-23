// SPDX-FileCopyrightText: 2024 Red Bee Media Ltd <https://www.redbeemedia.com/>
//
// SPDX-License-Identifier: MIT

import {
  Asset,
  ChannelAsset,
  ContractRestrictions,
  MarkerPoint,
  ProgramResponse,
} from "@ericssonbroadcastservices/rbm-ott-sdk";

import { PlayerError } from "../error";
import { IAdBlock, IAdDataRepresentation } from "./ad";

export type MediaType = "audio" | "video";
export type LiveAsset = ChannelAsset | ProgramResponse;

export interface IAdBlockMarker {
  startTime: number;
  duration: number;
  watched: boolean;
}

export const PlaybackState = {
  IDLE: "idle",
  LOADING: "loading",
  PLAYING: "playing",
  PAUSED: "paused",
  BUFFERING: "buffering",
  SEEKING: "seeking",
  ENDED: "ended",
  ERROR: "error",
} as const;
export type PlaybackState = (typeof PlaybackState)[keyof typeof PlaybackState];

export interface BasePlayerState {
  playbackState: PlaybackState;
  contentType?: ContentType | null;
  mediaType?: MediaType;

  currentTime: number;
  duration: number;
  seekable: Seekable;

  utcCurrentTime: number;
  utcDuration: number;
  utcSeekable: Seekable;

  currentAd?: IAdDataRepresentation | null;
  adMarkers?: IAdBlockMarker[];

  contentMarkers?: MarkerPoint[];

  volume: number;

  subtitleTrack: Track | null;
  subtitleTracks: Track[];

  audioTrack: Track | null;
  audioTracks: Track[];

  qualityLevel: QualityLevel;
  qualityLevels: QualityLevel[];

  droppedFrames: number;
  bufferingEvents: number;

  hasStarted: boolean;
  isMuted: boolean;
  isLive: boolean;
  isSeekable: boolean;
  isAtLiveEdge: boolean;
}

export interface CorePlayerState extends BasePlayerState {
  isAirPlaying: boolean;
  isAirPlayAvailable: boolean;
  contractRestrictions?: ContractRestrictions;
}

export interface PlayerState extends CorePlayerState {
  isCasting: boolean;
  isCastAvailable: boolean;
}

export const HtmlVideoElementEvents = {
  ERROR: "error",
  LOADEDMETADATA: "loadedmetadata",
  LOADSTART: "loadstart",
  LOADEDDATA: "loadeddata",
  CANPLAY: "canplay",
  CANPLAYTHROUGH: "canplaythrough",
  PLAY: "play",
  PLAYING: "playing",
  PAUSE: "pause",
  ENDED: "ended",
  TIMEUPDATE: "timeupdate",
  RATECHANGE: "ratechange",
  VOLUMECHANGE: "volumechange",
  SEEKED: "seeked",
  SEEKING: "seeking",
  STALLED: "stalled",
  WAITING: "waiting",
} as const;

export const PlayerEvents = {
  PLAY: "player:play",
  PAUSE: "player:pause",
  STOP: "player:stopped",
  START: "player:start",
  RESUME: "player:resume",
  PLAYING: "player:playing",
  SEEKING: "player:seeking",
  SEEK_TIME_CHANGE: "player:seek_time_change",
  SEEKED: "player:seeked",
  TIME_UPDATE: "player:timeupdate",
  ENDED: "player:ended",
  VOLUME_CHANGE: "player:volumechange",
  ERROR: "player:error",
  CAST_ERROR: "player:cast_error",
  LOADING: "player:loading",
  LOADED: "player:loaded",
  LOAD_START: "player:load_start",
  BUFFERING: "player:buffering",
  BUFFERED: "player:buffered",
  ID3: "player:id3",
  BITRATE_CHANGED: "player:bitrate_changed",
  CDN_CHANGED: "player:cdn_changed",
  AUDIO_CHANGED: "player:audio_changed",
  SUBTITLE_CHANGED: "player:subtitle_changed",
  LICENSE_EXPIRED: "player:license_expired",
  DROPPED_FRAMES: "player:dropped_frames",
  DRM_UPDATE: "player:drm:update",
  STATE_CHANGED: "player:state_changed",
  PROGRAM_CHANGED: "player:program_changed",
  NOT_ENTITLED: "player:not_entitled",
  BLACKOUT: "player:blackout",
  EMPTY_SLOT: "player:empty_slot",
  CAST_START: "player:cast:start",
  CAST_STOP: "player:cast:stop",
  AIRPLAY_START: "player:airplay:start",
  AIRPLAY_STOP: "player:airplay:stop",
  AD_START: "player:ad:start",
  AD_COMPLETE: "player:ad:complete",
  ADBLOCK_START: "player:adblock:start",
  ADBLOCK_COMPLETE: "player:adblock:complete",
  INTRO_START: "player:intro:start",
  INTRO_END: "player:intro:end",
  CHAPTER_START: "player:chapter:start",
  CHAPTER_END: "player:chapter:end",
  MARKER: "player:marker",
  METADATA_EVENT: "player:metadata_event",
  SESSION_ACQUIRED: "player:session_acquired",
  PLAYER_SETUP_COMPLETED: "player:setup_completed",
  ENTITLEMENT_GRANTED: "player:entitlement_granted",
} as const;
export type PlayerEvents = (typeof PlayerEvents)[keyof typeof PlayerEvents];

export type PlayerEngineName =
  | "Shaka Player"
  | "Hls.js"
  | "Native HTML Video"
  | "Dashjs";

export type Seekable = {
  start: number;
  end: number;
};

export type DrmUpdate =
  | "FAIRPLAY_LICENSE_REQUEST"
  | "FAIRPLAY_LICENSE_RESPONSE"
  | "FAIRPLAY_CERTIFICATE_REQUEST"
  | "FAIRPLAY_LICENSE_ERROR"
  | "FAIRPLAY_CERTIFICATE_ERROR"
  | "WIDEVINE_LICENSE_REQUEST"
  | "WIDEVINE_LICENSE_RESPONSE"
  | "WIDEVINE_LICENSE_ERROR"
  | "PLAYREADY_LICENSE_REQUEST"
  | "PLAYREADY_LICENSE_RESPONSE"
  | "PLAYREADY_LICENSE_ERROR";

export interface Track {
  id: string | number;
  language: string;
  label: string;
  kind?: string;
  raw?: any;
}

export type QualityLevel = {
  id: number;
  name?: string;
  bandwidth: number;
  width: number;
  height: number;
  framerate?: number;
};

export type DefaultPlayerEvent = {
  currentTime: number;
  duration: number;
  utcCurrentTime: number;
  utcDuration: number;
  seekable: Seekable;
  utcSeekable: Seekable;
};

export type StartPlayerEvent = DefaultPlayerEvent & {
  playSessionId?: string;
  startTime?: number;
  source: string;
  bitrate: number;
  qualityLevel: QualityLevel;
  qualityLevels: QualityLevel[];
};

export type VolumeChangePlayerEvent = DefaultPlayerEvent & {
  volume: number;
  muted: boolean;
};

export type ErrorPlayerEvent = PlayerError;

export type LoadingPlayerEvent = {
  playSessionId?: string;
};

export type LoadedPlayerEvent = DefaultPlayerEvent & {
  startTime?: number;
  playSessionId?: string;
};

export type BitrateChangedPlayerEvent = {
  bitrate: number;
  width: number;
  height: number;
};

export type TrackChangedPlayerEvent = DefaultPlayerEvent & {
  track?: Track;
};

export type DroppedFramesPlayerEvent = DefaultPlayerEvent & {
  droppedFrames: number;
};

export type DrmUpdatePlayerEvent = DefaultPlayerEvent & {
  type: DrmUpdate;
};

export type CoreStateChangedPlayerEvent = CorePlayerState;

export type ProgramChangedPlayerEvent = {
  channel: Asset;
  program?: LiveAsset;
  upnext?: LiveAsset;
};

export type CastPlayerEvent = {
  currentTime?: number;
};

export type AdBlockStartPlayerEvent = IAdBlock;
export type AdBlockCompletePlayerEvent = IAdBlock | undefined;
export type AdPlayerEvent = IAdDataRepresentation;

export type MarkerPlayerEvent = DefaultPlayerEvent & {
  contentMarker: MarkerPoint;
};

export type MetadataPlayerEvent = DefaultPlayerEvent & {
  engineName: PlayerEngineName;
  event: any;
  engineVersion?: string;
};

export type CorePlayerEventsMap = {
  [PlayerEvents.PLAY]: DefaultPlayerEvent;
  [PlayerEvents.PAUSE]: DefaultPlayerEvent;
  [PlayerEvents.STOP]: DefaultPlayerEvent;
  [PlayerEvents.START]: StartPlayerEvent;
  [PlayerEvents.RESUME]: DefaultPlayerEvent;
  [PlayerEvents.PLAYING]: DefaultPlayerEvent;
  [PlayerEvents.SEEKING]: DefaultPlayerEvent;
  [PlayerEvents.SEEK_TIME_CHANGE]: DefaultPlayerEvent;
  [PlayerEvents.SEEKED]: DefaultPlayerEvent;
  [PlayerEvents.TIME_UPDATE]: DefaultPlayerEvent;
  [PlayerEvents.ENDED]: DefaultPlayerEvent;
  [PlayerEvents.VOLUME_CHANGE]: VolumeChangePlayerEvent;
  [PlayerEvents.ERROR]: ErrorPlayerEvent;
  [PlayerEvents.CAST_ERROR]: ErrorPlayerEvent;
  [PlayerEvents.LOADING]: LoadingPlayerEvent;
  [PlayerEvents.LOADED]: LoadedPlayerEvent;
  [PlayerEvents.LOAD_START]: undefined;
  [PlayerEvents.BUFFERING]: DefaultPlayerEvent;
  [PlayerEvents.BUFFERED]: DefaultPlayerEvent;
  [PlayerEvents.ID3]: DefaultPlayerEvent;
  [PlayerEvents.BITRATE_CHANGED]: BitrateChangedPlayerEvent;
  [PlayerEvents.CDN_CHANGED]: DefaultPlayerEvent;
  [PlayerEvents.AUDIO_CHANGED]: TrackChangedPlayerEvent;
  [PlayerEvents.SUBTITLE_CHANGED]: TrackChangedPlayerEvent;
  [PlayerEvents.LICENSE_EXPIRED]: DefaultPlayerEvent;
  [PlayerEvents.DROPPED_FRAMES]: DroppedFramesPlayerEvent;
  [PlayerEvents.DRM_UPDATE]: DrmUpdatePlayerEvent;
  [PlayerEvents.STATE_CHANGED]: CoreStateChangedPlayerEvent;
  [PlayerEvents.PROGRAM_CHANGED]: ProgramChangedPlayerEvent;
  [PlayerEvents.NOT_ENTITLED]: LiveAsset;
  [PlayerEvents.BLACKOUT]: LiveAsset;
  [PlayerEvents.EMPTY_SLOT]: undefined;
  [PlayerEvents.CAST_START]: CastPlayerEvent;
  [PlayerEvents.CAST_STOP]: CastPlayerEvent;
  [PlayerEvents.AIRPLAY_START]: undefined;
  [PlayerEvents.AIRPLAY_STOP]: undefined;
  [PlayerEvents.AD_START]: AdPlayerEvent;
  [PlayerEvents.AD_COMPLETE]: AdPlayerEvent;
  [PlayerEvents.ADBLOCK_START]: AdBlockStartPlayerEvent;
  [PlayerEvents.ADBLOCK_COMPLETE]: AdBlockCompletePlayerEvent;
  [PlayerEvents.INTRO_START]: MarkerPlayerEvent;
  [PlayerEvents.INTRO_END]: MarkerPlayerEvent;
  [PlayerEvents.CHAPTER_START]: MarkerPlayerEvent;
  [PlayerEvents.CHAPTER_END]: MarkerPlayerEvent;
  [PlayerEvents.MARKER]: MarkerPlayerEvent;
  [PlayerEvents.METADATA_EVENT]: DefaultPlayerEvent;
  [PlayerEvents.SESSION_ACQUIRED]: undefined;
  [PlayerEvents.PLAYER_SETUP_COMPLETED]: undefined;
  [PlayerEvents.ENTITLEMENT_GRANTED]: undefined;
};

export type StateChangedPlayerEvent = CorePlayerState;

export type PlayerEventsMap = CorePlayerEventsMap & {
  [PlayerEvents.STATE_CHANGED]: PlayerState;
};

export const ContentType = {
  VOD: "vod",
  LIVE: "live",
  AD: "ad",
  PODCAST: "podcast",
} as const;
export type ContentType = (typeof ContentType)[keyof typeof ContentType];

/**
 * A shared interface for PlayerCore & CastSender to align method signatures for shared functionality.
 */
export interface Controller {
  getState(): BasePlayerState | CorePlayerState;
  getCurrentTime(): number | undefined;
  getVolume(): number | undefined;
  play(): Promise<void> | undefined;
  getSeekable(): Seekable | undefined;
  pause(): void;
  toggleMuted(): void;
  scrub(change: number): void;
  seekTo(time: number): void;
  seekToLive(): void;
  setQualityLevel(level: QualityLevel): void;
  getQualityLevels(): QualityLevel[];
  setAudioTrack(track: Track): void;
  setSubtitleTrack(track?: Track): void;
  setVolume({ percentage }: { percentage: number }): void;
  setMuted(muted: boolean): void;
  getAudioTrack(): Track | undefined;
  getAudioTracks(): Track[];
  getSubtitleTrack(): Track | undefined;
  getSubtitleTracks(): Track[];
  isLive(): boolean | undefined;
  isPlaying(): boolean | undefined;
  isVolumeReadOnly(): Promise<boolean>;
  toggleFullscreen?: () => void;
}
