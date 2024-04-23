// SPDX-FileCopyrightText: 2024 Red Bee Media Ltd <https://www.redbeemedia.com/>
//
// SPDX-License-Identifier: MIT

import {
  Asset,
  MediaFormat,
  MediaFormatType,
  PlayResponse,
} from "@ericssonbroadcastservices/rbm-ott-sdk";

import {
  DRMType,
  IAdsOptions,
  IMediaInfo,
  LiveAsset,
  LogLevel,
  PlayerEngineName,
} from "@ericssonbroadcastservices/js-player-shared";

import { TDeviceAdapter } from "../device/interfaces";
import { TAudioKind, TTextKind } from "../engines/interfaces";

export interface IPlayerCoreOptions {
  customer?: string;
  businessUnit?: string;
  exposureBaseUrl?: string;
  sessionToken?: string;
  wrapperElement: HTMLElement;
  fullscreenElement?: string;
  playToken?: string;
  autoplay?: boolean;
  muted?: boolean;
  nativeSkin?: boolean;
  preferredFormats?: string[];
  keysystem?: DRMType;
  adobePrimetimeToken?: string;
  castAppId?: string;
  disableCast?: boolean;
  disableAirPlay?: boolean;
  maxResolution?: string;
  logLevel?: LogLevel;
  appName?: string;
  customShakaConfiguration?: Record<string, any>;
  customHlsJsConfiguration?: Record<string, any>;
  customDashJSConfiguration?: Record<string, any>;
  locale?: string;
  metadataURIs?: string[];
  deviceAdapter?: TDeviceAdapter;
}

export interface InstanceSettingsInterface {
  playerSDKVersion?: string;
  supportedKeySystem?: DRMType;
  engineName?: PlayerEngineName;
  engineVersion?: string;
  isAsset: boolean;
  formats?: MediaFormat[];
  initOptions: IPlayerCoreOptions;
  loadOptions?: ILoadOptions;
  playResponse?: PlayResponse;
  assetMetadata?: Asset;
  mediaInfo?: IMediaInfo;
  programData?: {
    current?: LiveAsset;
    next?: LiveAsset;
  };
}

export interface IPlayerSession {
  assetId?: string;
  initOptions?: IPlayerCoreOptions;
  loadOptions?: ILoadOptions;
  sessionToken?: string;
  playSessionId?: string;
  requestId?: string;
  playbackFormat?: MediaFormatType;
  playerEngine?: IPlayerEngine;
  autoplay?: boolean;
  locale: string;
  cdnProvider?: string;
  analyticsPostInterval?: number;
  analyticsBucket?: number;
  analyticsTag?: string;
  analyticsBaseUrl?: string;
  analyticsPercentage?: number;
  exposureBaseUrl?: string;
}

export interface IPlayerEngine {
  name: string;
  version: string;
}

export interface IManifestOptions {
  start?: number;
  end?: number;
}

export interface ILoadOptions {
  source: string;
  startTime?: number;
  poster?: string;
  audioOnly?: boolean;
  ads?: IAdsOptions;
  materialProfile?: string;
  manifest?: IManifestOptions;
}

export type AudioIdentifier = { language?: string; kind?: TAudioKind };
export type TextIdentifier = { language?: string; kind?: TTextKind };
