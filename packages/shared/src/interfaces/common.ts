// SPDX-FileCopyrightText: 2024 Red Bee Media Ltd <https://www.redbeemedia.com/>
//
// SPDX-License-Identifier: MIT

export interface IMediaInfo {
  isLive?: boolean;
  lowLatency?: boolean;
  ssai?: boolean;
}

export const DRMType = {
  PLAYREADY: "com.microsoft.playready",
  WIDEVINE: "com.widevine.alpha",
  FAIRPLAY: "com.apple.fps",
} as const;
export type DRMType = (typeof DRMType)[keyof typeof DRMType];

export type TIFAType =
  | "idfa"
  | "rida"
  | "aaid"
  | "tifa"
  | "ppid"
  | "sspid"
  | "sessionid";

export type TAppType = "samsung_tv" | "lg_tv" | "chromecast" | "browser";

export type TBrowser = "chrome" | "firefox" | "safari" | "edge" | "unknown";

export type TWebOSVersion = `${number}.${number}.${number}`;
export type TTizenVersion = `${number}.${number}`;

export type TBrowserModel = `browser-${TBrowser}-${number}`;

export type TSamsungTVModel = `samsung-${TTizenVersion}`;
export type TLGTVModel = `lg-${TWebOSVersion}`;

export type TCastModel =
  | "cc-googletv-hd"
  | "cc-googletv"
  | "cc-builtin"
  | "cc-ultra"
  | "cc-3"
  | "cc-2"
  | "cc-1"
  | "cc-unknown";

export type TDeviceModel =
  | TBrowserModel
  | TSamsungTVModel
  | TLGTVModel
  | TCastModel
  | string;

export type TDeviceType =
  | "desktop"
  | "tablet"
  | "mobile"
  | "ctv"
  | "airplay"
  | "chromecast";

export const KeySystem = {
  FAIRPLAY: "com.apple.fps.1_0",
  WIDEVINE: "com.widevine.alpha",
  PLAYREADY: "com.microsoft.playready",
  PLAYREADY_CHROMECAST: "com.chromecast.playready",
} as const;
