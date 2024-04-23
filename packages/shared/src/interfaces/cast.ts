// SPDX-FileCopyrightText: 2024 Red Bee Media Ltd <https://www.redbeemedia.com/>
//
// SPDX-License-Identifier: MIT

import { PlayerError } from "../error";
import { BasePlayerState } from "./player";

export const CastSenderEvent = {
  AVAILABILITY_CHANGED: "cast:availability_changed",
  CONNECTED: "cast:connected",
  RECONNECTED: "cast:reconnected",
  DISCONNECTED: "cast:disconnected",
  STATE_CHANGE: "cast:state_change",
  METADATA_UPDATE: "cast:metadata_update",
  ERROR: "cast:error",
} as const;

export type CastSenderEventMap = {
  [CastSenderEvent.AVAILABILITY_CHANGED]: { available: boolean };
  [CastSenderEvent.CONNECTED]: { isResumed: boolean };
  [CastSenderEvent.RECONNECTED]: undefined;
  [CastSenderEvent.DISCONNECTED]: undefined;
  [CastSenderEvent.STATE_CHANGE]: BasePlayerState;
  [CastSenderEvent.METADATA_UPDATE]: { title?: string; imageUrl?: string };
  [CastSenderEvent.ERROR]: PlayerError;
};
