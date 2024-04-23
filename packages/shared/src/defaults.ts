// SPDX-FileCopyrightText: 2024 Red Bee Media Ltd <https://www.redbeemedia.com/>
//
// SPDX-License-Identifier: MIT

import {
  BasePlayerState,
  PlaybackState,
  QualityLevel,
} from "./interfaces/player";

export const AUTO_QUALITY_LEVEL_DEFINITION: QualityLevel = {
  id: -1,
  name: "auto",
  bandwidth: -1,
  width: -1,
  height: -1,
};

export const DefaultPlayerState: BasePlayerState = {
  playbackState: PlaybackState.IDLE,
  contentType: undefined,
  mediaType: undefined,

  currentTime: 0,
  duration: 0,
  seekable: { start: 0, end: 0 },

  utcCurrentTime: 0,
  utcDuration: 0,
  utcSeekable: { start: 0, end: 0 },

  currentAd: null,
  adMarkers: [],

  contentMarkers: [],

  volume: 0,

  subtitleTrack: null,
  subtitleTracks: [],

  audioTrack: null,
  audioTracks: [],

  qualityLevel: AUTO_QUALITY_LEVEL_DEFINITION,
  qualityLevels: [],

  droppedFrames: 0,
  bufferingEvents: 0,

  hasStarted: false,
  isMuted: false,
  isLive: false,
  isSeekable: false,
  isAtLiveEdge: false,
};
