// SPDX-FileCopyrightText: 2024 Red Bee Media Ltd <https://www.redbeemedia.com/>
//
// SPDX-License-Identifier: MIT

import { TIFAType } from "./common";

export const TrackingEvent = {
  LOADED: "loaded",
  START: "start",
  IMPRESSION: "impression",
  COMPLETE: "complete",
  FIRST_QUARTILE: "firstQuartile",
  MIDPOINT: "midpoint",
  THIRD_QUARTILE: "thirdQuartile",
  CLICK_THROUGH: "clickThrough",
} as const;
export type TrackingEvent = (typeof TrackingEvent)[keyof typeof TrackingEvent];

export interface IAdDataRepresentation {
  id: string;
  title: string;
  system: string;
  duration: number;
  trackingEvents: {
    [key in TrackingEvent]?: string[];
  };
  clickThrough?: string;

  adIndex?: number;
  adsTotal?: number;
}

export interface IAdBlock {
  startTime: number;
  relativeStartTime: number; // relative to the content, eg. absolute time might be 120s but in relation to the content it starts 80s in.
  endTime: number;
  duration: number;
  ads: IAdDataRepresentation[];
}

export interface IAdsOptions {
  latitude?: number;
  longitude?: number;
  mute?: boolean;
  autoplay?: boolean;
  consent?: string;
  width?: number;
  height?: number;
  pageUrl?: string;
  domain?: string;
  ifa?: string;
  ifaType?: TIFAType;
  limitAdTracking?: boolean;
  /**
   * These custom parameters will be added to the querystring of the play request.
   * e.g. ?customParam1=value1&customParam2=value2 etc
   */
  [key: string]: any;
}
