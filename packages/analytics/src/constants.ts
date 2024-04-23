// SPDX-FileCopyrightText: 2024 Red Bee Media Ltd <https://www.redbeemedia.com/>
//
// SPDX-License-Identifier: MIT

export const REDBEE_ANALYTICS_EVENT = {
  CREATED: "Playback.Created",
  PLAYER_READY: "Playback.PlayerReady",
  PLAYING: "Playback.Started",
  PAUSED: "Playback.Paused",
  SEEKED: "Playback.ScrubbedTo",
  START_CASTING: "Playback.StartCasting",
  STOP_CASTING: "Playback.StopCasting",
  START_AIRPLAY: "Playback.StartAirplay",
  STOP_AIRPLAY: "Playback.StopAirplay",
  HANDSHAKE: "Playback.HandshakeStarted",
  RESUME: "Playback.Resumed",
  BITRATE_CHANGED: "Playback.BitrateChanged",
  DRM_SESSION_UPDATED: "Playback.DRM",
  ENDED: "Playback.Completed",
  ERROR: "Playback.Error",
  ABORTED: "Playback.Aborted",
  BUFFERING: "Playback.BufferingStarted",
  BUFFERED: "Playback.BufferingEnded",
  HEARTBEAT: "Playback.Heartbeat",
  AD_STARTED: "Playback.AdStarted",
  AD_ENDED: "Playback.AdCompleted",
  DROPPED_FRAMES: "Playback.DroppedFrames",
  PROGRAM_CHANGED: "Playback.ProgramChanged",
};
