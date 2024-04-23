// SPDX-FileCopyrightText: 2024 Red Bee Media Ltd <https://www.redbeemedia.com/>
//
// SPDX-License-Identifier: MIT

import {
  IAdBlock,
  IAdDataRepresentation,
  TrackingEvent,
} from "@ericssonbroadcastservices/js-player-shared";

export const TrackingCuePoints: { [key: number]: TrackingEvent } = {
  25: TrackingEvent.FIRST_QUARTILE,
  50: TrackingEvent.MIDPOINT,
  75: TrackingEvent.THIRD_QUARTILE,
};

export const AdMonitorEvent = {
  AD_START: "AD_START",
  AD_END: "AD_END",
  ADBLOCK_START: "ADBLOCK_START",
  ADBLOCK_END: "ADBLOCK_END",
  ADBLOCK_ADDED: "ADBLOCK_ADDED",
} as const;
export type AdMonitorEvent =
  (typeof AdMonitorEvent)[keyof typeof AdMonitorEvent];

export type AdMonitorEventMap = {
  [AdMonitorEvent.AD_START]: IAdDataRepresentation & {
    adIndex: number;
    adsTotal: number;
  };
  [AdMonitorEvent.AD_END]: IAdDataRepresentation;
  [AdMonitorEvent.ADBLOCK_START]: IAdBlock;
  [AdMonitorEvent.ADBLOCK_END]: IAdBlock | undefined;
  [AdMonitorEvent.ADBLOCK_ADDED]: IAdBlock;
};

export const StitcherEvent = {
  ADBLOCK: "ADBLOCK",
} as const;
export type StitcherEvent = (typeof StitcherEvent)[keyof typeof StitcherEvent];

export type StitcherEventMap = {
  [StitcherEvent.ADBLOCK]: IAdBlock;
};
