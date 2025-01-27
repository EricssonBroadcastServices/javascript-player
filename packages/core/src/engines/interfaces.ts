// SPDX-FileCopyrightText: 2024 Red Bee Media Ltd <https://www.redbeemedia.com/>
//
// SPDX-License-Identifier: MIT

import { DrmUrls } from "@ericssonbroadcastservices/rbm-ott-sdk";
import { FilteredMediaEvent } from "@eyevinn/media-event-filter";

import {
  DRMType,
  DrmUpdate,
  PlaybackState,
  PlayerEngineName,
  PlayerError,
  Track,
} from "@ericssonbroadcastservices/js-player-shared";

import { AudioIdentifier, TextIdentifier } from "../utils/interfaces";

export type TTextKind = TextTrackKind | "forced" | string | undefined;

export type TAudioKind =
  | "alternative"
  | "main"
  | "description"
  | "translation"
  | "main-desc"
  | "commentary"
  | string;

export type HTMLMediaEvent = Event & { target: HTMLMediaElement };

const CustomEngineEvents = {
  VOLUME_CHANGE: "volumechange",
  ERROR: "error",
  DROPPED_FRAMES: "dropped_frames",
  BITRATE_CHANGED: "bitrate_changed",
  AUDIO_CHANGED: "audio_changed",
  SUBTITLE_CHANGED: "subtitle_changed",
  SUBTITLE_CUE_CHANGED: "subtitle_cue_changed",
  TRACKS_CHANGED: "tracks_changed",
  DRM_UPDATE: "drm:update",
  STATE_CHANGED: "state_changed",
  METADATA_EVENT: "metadata_event",
  PLAYBACK_RATE_CHANGED: "playback_rate_changed",
} as const;

export const EngineEvents = { ...FilteredMediaEvent, ...CustomEngineEvents };
export type EngineEvents = (typeof EngineEvents)[keyof typeof EngineEvents];

export type DefaultEngineEvent = undefined;
export type VolumeChangeEngineEvent = { volume: number; muted: boolean };
export type ErrorEngineEvent = PlayerError;
export type TrackChangedEngineEvent = {
  track?: Track;
  shouldUpdatePreferences?: boolean;
};
export type SubtitleCueChangeEngineEvent = VTTCue[];
export type TracksChangedEngineEvent = {
  subtitleTrack?: Track;
  audioTrack?: Track;
  subtitleTracks: Track[];
  audioTracks: Track[];
};
export type DroppedFramesEngineEvent = number;
export type BitrateChangedEngineEvent = {
  bitrate: number;
  width: number;
  height: number;
};
export type DrmUpdateEngineEvent = DrmUpdate;
export type StateChangedEngineEvent = PlaybackState;
export type MetadataEngineEvent = {
  engineName: PlayerEngineName;
  event: any;
  engineVersion?: string;
};
export type PlaybackRateChangedEngineEvent = { playbackRate: number };

export type TimeUpdateEngineEvent = { currentTime: number };

export type EngineEventsMap = {
  // CustomeEngineEvents
  [EngineEvents.VOLUME_CHANGE]: VolumeChangeEngineEvent;
  [EngineEvents.ERROR]: ErrorEngineEvent;
  [EngineEvents.DROPPED_FRAMES]: DroppedFramesEngineEvent;
  [EngineEvents.BITRATE_CHANGED]: BitrateChangedEngineEvent;
  [EngineEvents.AUDIO_CHANGED]: TrackChangedEngineEvent;
  [EngineEvents.SUBTITLE_CHANGED]: TrackChangedEngineEvent;
  [EngineEvents.SUBTITLE_CUE_CHANGED]: SubtitleCueChangeEngineEvent;
  [EngineEvents.TRACKS_CHANGED]: TracksChangedEngineEvent;
  [EngineEvents.DRM_UPDATE]: DrmUpdateEngineEvent;
  [EngineEvents.STATE_CHANGED]: StateChangedEngineEvent;
  [EngineEvents.METADATA_EVENT]: MetadataEngineEvent;
  [EngineEvents.PLAYBACK_RATE_CHANGED]: PlaybackRateChangedEngineEvent;

  // FilteredMediaEvent
  [EngineEvents.LOADED]: DefaultEngineEvent;
  [EngineEvents.SEEKING]: DefaultEngineEvent;
  [EngineEvents.SEEKED]: DefaultEngineEvent;
  [EngineEvents.BUFFERING]: DefaultEngineEvent;
  [EngineEvents.BUFFERED]: DefaultEngineEvent;
  [EngineEvents.PLAY]: DefaultEngineEvent;
  [EngineEvents.PLAYING]: DefaultEngineEvent;
  [EngineEvents.PAUSE]: DefaultEngineEvent;
  [EngineEvents.ENDED]: DefaultEngineEvent;
  [EngineEvents.TIME_UPDATE]: TimeUpdateEngineEvent;
};

export interface ILicense {
  [DRMType.FAIRPLAY]?: DrmUrls;
  [DRMType.PLAYREADY]?: DrmUrls;
  [DRMType.WIDEVINE]?: DrmUrls;
}

export interface IHTMLMediaAudioTrack {
  id: string;
  language: string;
  label: string;
  kind: string;
  enabled: boolean;
}

export type TLoadParameters = {
  src: string;
  license?: ILicense;
  startTime?: number;
  audio?: AudioIdentifier;
  subtitle?: TextIdentifier;
};
