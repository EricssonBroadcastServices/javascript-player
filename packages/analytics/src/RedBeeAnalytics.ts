// SPDX-FileCopyrightText: 2024 Red Bee Media Ltd <https://www.redbeemedia.com/>
//
// SPDX-License-Identifier: MIT

import {
  LogLevel,
  Logger,
  TDeviceModel,
  getDeviceId,
} from "@ericssonbroadcastservices/js-player-shared";

import { ClockOffsetProvider } from "./ClockOffsetProvider";
import { REDBEE_ANALYTICS_EVENT } from "./constants";
import { EVENT_POOL_SEND, EventPool, IPayload } from "./EventPool";
import { IDeviceStats } from "./utils/helpers";

const DEFAULT_HEADERS = {
  "content-type": "application/json",
};

const referrer = (): string => {
  if (document.referrer) return document.referrer;
  if (window.self === window.top) return "";
  // if in an iframe we want to get the parent page url
  // window.top can throw an error ( just by accessing it! ) so it needs to be wrapped.
  try {
    return window.top?.location.href ?? "";
  } catch (e) {
    return "";
  }
};

const DEFAULT_DEVICE: Partial<IDeviceInfo> = {
  appType: "browser",
  pageUrl: window.location.href,
  referrer: referrer(),
};

interface IPlayerFields {
  Technology: string;
  TechVersion: string;
  Player: string;
  Version: string;
  StreamingTechnology: string;
  CDNVendor?: string;
  AnalyticsPostInterval?: number;
  AnalyticsBucket?: number;
  AnalyticsTag?: string;
}

export interface IDeviceInfo {
  os: string;
  osVersion: string;
  model: TDeviceModel;
  modelNumber?: string;
  manufacturer: string;
  appType: "samsung_tv" | "lg_tv" | "chromecast" | "browser";
  appName?: string;
  pageUrl?: string;
  referrer?: string;
  deviceStats?: IDeviceStats;
}

export interface IRedBeeAnalyticsOptions {
  customer: string;
  businessUnit: string;
  sessionToken: string;
  analyticsBaseUrl: string;
  device: IDeviceInfo;
  debug?: boolean;
}

export class RedBeeAnalytics {
  private logger: Logger;

  private customer: string;
  private businessUnit: string;
  private baseUrl?: string;
  private customerSpecificBaseUrl?: string;

  private assetId?: string;

  private eventPool?: EventPool;
  private sessionId?: string;
  private startTime?: number;
  private requestHeaders: { [header: string]: string };
  private droppedFramesCount = 0;

  private clockOffsetProvider?: ClockOffsetProvider;

  private device: IDeviceInfo;
  private deviceId: string;
  private playerFields: IPlayerFields;

  constructor({
    customer,
    businessUnit,
    sessionToken,
    analyticsBaseUrl,
    device,
    debug,
  }: IRedBeeAnalyticsOptions) {
    if (!customer || !businessUnit) {
      throw new Error("No Customer or BusinessUnit defined");
    }
    this.customer = customer;
    this.businessUnit = businessUnit;
    if (!sessionToken) {
      throw new Error("No sessionToken defined");
    }

    this.deviceId = getDeviceId(sessionToken);

    this.logger = new Logger({
      prefix: "[RedBeeAnalytics]",
      logLevel: debug ? LogLevel.DEBUG : LogLevel.NONE,
    });

    this.setAnalyticsBaseUrl(analyticsBaseUrl);

    this.requestHeaders = Object.assign(
      {
        Authorization: `Bearer ${sessionToken}`,
      },
      DEFAULT_HEADERS
    );

    this.device = Object.assign({}, DEFAULT_DEVICE, device);
    this.playerFields = {
      Player: "",
      Version: "",
      Technology: "",
      TechVersion: "",
      StreamingTechnology: "",
    };
  }

  private async _send(payloadQuene: IPayload[]): Promise<boolean> {
    const url = new URL(
      `${this.customerSpecificBaseUrl}/eventsink/send`
    ).toString();
    const data = {
      DispatchTime: Date.now(),
      Customer: this.customer,
      BusinessUnit: this.businessUnit,
      SessionId: this.sessionId,
      Payload: payloadQuene,
      ClockOffset: (await this.clockOffsetProvider?.getClockOffset()) || 0,
    };
    if (this.logger.logLevel === LogLevel.DEBUG) {
      this.logger.debug("send", url, data);
      return true;
    }
    try {
      const response = await fetch(url, {
        method: "POST",
        mode: "cors",
        body: JSON.stringify(data),
        headers: this.requestHeaders,
      });
      return response.ok;
    } catch (error) {
      this.logger.error("_send() failed", error);
      payloadQuene.forEach((event: any) => {
        this.eventPool?.add(event);
      });
      return false;
    }
  }

  private isActive(): boolean {
    return !!(this.sessionId && this.eventPool);
  }

  setAnalyticsBaseUrl(analyticsBaseUrl: string): void {
    this.baseUrl = analyticsBaseUrl;
    this.customerSpecificBaseUrl = new URL(
      `/v2/customer/${this.customer}/businessunit/${this.businessUnit}`,
      this.baseUrl
    ).toString();
  }

  clear(): void {
    this.logger.info("clear", this.sessionId);
    this.sessionId = undefined;
    this.eventPool = undefined;
  }

  async init(sessionId?: string): Promise<boolean> {
    if (!this.customerSpecificBaseUrl) {
      throw new Error("[RedBeeAnalytics] analyticsBaseUrl was never set");
    }
    if (!sessionId) {
      this.logger.info("no sessionId provided, session will not be tracked");
      return false;
    }
    this.logger.debug("init", sessionId);
    this.clear();
    this.sessionId = sessionId;
    this.eventPool = new EventPool(sessionId, this.logger);
    this.eventPool.on(EVENT_POOL_SEND, this._send.bind(this));
    return true;
  }

  deviceInfoEvent(): void {
    if (!this.isActive()) {
      return;
    }
    const deviceInfoEvent = {
      EventType: "Device.Info",
      Height: window.screen ? window.screen.height : 0,
      Width: window.screen ? window.screen.width : 0,
      Name: window.navigator ? window.navigator.product : "",
      ...this.getDefaultFields(),
    };

    this.eventPool?.add(deviceInfoEvent);
  }

  created({
    assetId,
    autoplay = true,
    player,
    playerVersion,
    streamingTechnology,
    cdnProvider,
    analyticsPostInterval,
    analyticsBucket,
    analyticsTag,
    analyticsBaseUrl,
    analyticsPercentage,
    requestId,
    deviceModel,
    deviceModelNumber,
    deviceStats,
    exposureBaseUrl,
  }: {
    assetId?: string;
    autoplay?: boolean;
    player?: string;
    playerVersion?: string;
    streamingTechnology?: string;
    cdnProvider?: string;
    analyticsPostInterval?: number;
    analyticsBucket?: number;
    analyticsTag?: string;
    analyticsBaseUrl?: string;
    analyticsPercentage?: number;
    requestId?: string;
    deviceModel?: TDeviceModel;
    deviceModelNumber?: string;
    deviceStats?: IDeviceStats;
    exposureBaseUrl?: string;
  }): void {
    if (!this.isActive()) {
      return;
    }

    this.clockOffsetProvider = new ClockOffsetProvider(exposureBaseUrl);

    this.logger.debug("created", this.sessionId);
    this.assetId = assetId || "";
    this.device.model = deviceModel || this.device.model;
    this.device.deviceStats = deviceStats;
    this.device.modelNumber = deviceModelNumber || this.device.modelNumber;

    this.updatePlayerFields({
      Player: player,
      Version: playerVersion,
      StreamingTechnology: streamingTechnology,
      ...(cdnProvider && { CDNVendor: cdnProvider }),
      ...(analyticsPostInterval && {
        AnalyticsPostInterval: analyticsPostInterval,
      }),
      ...(analyticsBucket && { AnalyticsBucket: analyticsBucket }),
      ...(analyticsTag && { AnalyticsTag: analyticsTag }),
      ...(analyticsBaseUrl && { AnalyticsBaseUrl: analyticsBaseUrl }),
      ...(analyticsPercentage && { AnalyticsPercentage: analyticsPercentage }),
    });

    if (analyticsPostInterval) {
      this.eventPool?.updateInterval(analyticsPostInterval);
    }

    const payload = {
      EventType: REDBEE_ANALYTICS_EVENT.CREATED,
      AssetId: this.assetId,
      AutoPlay: autoplay,
      ...(requestId && { RequestId: requestId }),
      ...this.getDefaultFields(),
    };

    this.eventPool?.add(payload);
    this.deviceInfoEvent();
  }

  assetLoaded({
    assetId,
    programId,
  }: {
    sessionId?: string;
    assetId?: string;
    programId?: string;
  }): void {
    if (!this.isActive()) {
      return;
    }
    this.logger.debug("HandshakeStarted", this.assetId);
    if (assetId && this.assetId !== assetId) {
      this.assetId = assetId;
    }
    const payload = {
      EventType: REDBEE_ANALYTICS_EVENT.HANDSHAKE,
      AssetId: this.assetId,
      ...(programId && { programId }),
      ...this.getDefaultFields(),
    };
    this.eventPool?.add(payload);
  }

  playerReady({
    startTime,
    playerTech,
    techVersion,
  }: {
    startTime?: number;
    playerTech: string;
    techVersion?: string;
  }): void {
    if (!this.isActive()) {
      return;
    }
    this.logger.debug("playerReady", this.sessionId);
    this.startTime = startTime;

    this.updatePlayerFields({
      Technology: playerTech,
      TechVersion: techVersion,
    });

    const payload = {
      EventType: REDBEE_ANALYTICS_EVENT.PLAYER_READY,
      ...this.getDefaultFields(),
    };

    this.eventPool?.add(payload);
  }

  playing({
    bitrate,
    duration = 0,
    mediaLocator,
  }: {
    bitrate?: number;
    duration?: number;
    mediaLocator: string;
  }): void {
    if (!this.isActive()) {
      return;
    }
    this.logger.debug("playing");
    const payload = {
      EventType: REDBEE_ANALYTICS_EVENT.PLAYING,
      AssetId: this.assetId,
      Bitrate: bitrate,
      VideoLength: duration * 1000,
      MediaLocator: mediaLocator,
      ...this.getDefaultFields(),
      OffsetTime: this.startTime,
    };
    this.eventPool?.add(payload, true);
  }

  paused(currentTime?: number): void {
    if (!this.isActive()) {
      return;
    }
    this.logger.debug("paused", currentTime);
    const payload = {
      EventType: REDBEE_ANALYTICS_EVENT.PAUSED,
      ...this.getDefaultFields(currentTime),
    };
    this.eventPool?.add(payload);
  }

  seeked(seekTime?: number): void {
    if (!this.isActive()) {
      return;
    }
    this.logger.debug("seeked", seekTime);
    const payload = {
      EventType: REDBEE_ANALYTICS_EVENT.SEEKED,
      ...this.getDefaultFields(seekTime),
    };
    this.eventPool?.add(payload);
  }

  startCasting(): void {
    if (!this.isActive()) {
      return;
    }
    this.logger.debug("startCasting", Date.now());
    const payload = {
      EventType: REDBEE_ANALYTICS_EVENT.START_CASTING,
      ...this.getDefaultFields(),
    };
    this.eventPool?.add(payload);
  }

  stopCasting(): void {
    if (!this.isActive()) {
      return;
    }
    this.logger.debug("stopCasting", Date.now());
    const payload = {
      EventType: REDBEE_ANALYTICS_EVENT.STOP_CASTING,
      ...this.getDefaultFields(),
    };
    this.eventPool?.add(payload);
  }

  startAirPlay(): void {
    if (!this.isActive()) {
      return;
    }
    this.logger.debug("startAirPlay", Date.now());
    const payload = {
      EventType: REDBEE_ANALYTICS_EVENT.START_AIRPLAY,
      ...this.getDefaultFields(),
    };
    this.eventPool?.add(payload);
  }

  stopAirPlay(): void {
    if (!this.isActive()) {
      return;
    }
    this.logger.debug("stopAirPlay", Date.now());
    const payload = {
      EventType: REDBEE_ANALYTICS_EVENT.STOP_AIRPLAY,
      ...this.getDefaultFields(),
    };
    this.eventPool?.add(payload);
  }

  heartbeat(nowTime?: number): void {
    if (!this.isActive()) {
      return;
    }
    this.logger.debug("heartbeat");
    const payload = {
      EventType: REDBEE_ANALYTICS_EVENT.HEARTBEAT,
      ...this.getDefaultFields(nowTime),
    };
    this.eventPool?.add(payload);
  }

  resume(currentTime?: number): void {
    if (!this.isActive()) {
      return;
    }
    this.logger.debug("resume", currentTime);
    const payload = {
      EventType: REDBEE_ANALYTICS_EVENT.RESUME,
      ...this.getDefaultFields(currentTime),
    };
    this.eventPool?.add(payload);
  }

  bitrateChanged(nowTime?: number, bitrate?: number): void {
    if (!this.isActive()) {
      return;
    }
    if (!nowTime) return;
    this.logger.debug("bitrateChanged", nowTime, bitrate);
    const payload = {
      EventType: REDBEE_ANALYTICS_EVENT.BITRATE_CHANGED,
      Bitrate: bitrate,
      ...this.getDefaultFields(nowTime),
    };
    this.eventPool?.add(payload);
  }

  buffering(nowTime?: number): void {
    if (!this.isActive()) {
      return;
    }
    this.logger.debug("buffering", nowTime);
    const payload = {
      EventType: REDBEE_ANALYTICS_EVENT.BUFFERING,
      ...this.getDefaultFields(nowTime),
    };
    this.eventPool?.add(payload);
  }

  buffered(nowTime?: number): void {
    if (!this.isActive()) {
      return;
    }
    this.logger.debug("buffered", nowTime);
    const payload = {
      EventType: REDBEE_ANALYTICS_EVENT.BUFFERED,
      ...this.getDefaultFields(nowTime),
    };
    this.eventPool?.add(payload);
  }

  dispose(nowTime?: number): void {
    if (!this.isActive()) {
      return;
    }
    this.logger.debug("dispose");
    const payload = {
      EventType: REDBEE_ANALYTICS_EVENT.ABORTED,
      ...this.getDefaultFields(nowTime),
    };
    this.eventPool?.add(payload);
  }

  mediaEnded(nowTime?: number): void {
    if (!this.isActive()) {
      return;
    }
    this.logger.debug("mediaEnded");
    const payload = {
      EventType: REDBEE_ANALYTICS_EVENT.ENDED,
      ...this.getDefaultFields(nowTime),
    };
    this.eventPool?.add(payload);
  }

  adStarted(nowTime?: number, adId?: string): void {
    if (!this.isActive()) {
      return;
    }
    this.logger.debug(`ssai adStarted, adId: ${adId}`);
    const payload = {
      EventType: REDBEE_ANALYTICS_EVENT.AD_STARTED,
      AdMediaId: adId,
      ...this.getDefaultFields(nowTime),
    };
    this.eventPool?.add(payload);
  }

  adCompleted(nowTime?: number, adId?: string): void {
    if (!this.isActive()) {
      return;
    }
    this.logger.debug(`ssai adCompleted, adId: ${adId}`);
    const payload = {
      EventType: REDBEE_ANALYTICS_EVENT.AD_ENDED,
      AdMediaId: adId,
      ...this.getDefaultFields(nowTime),
    };
    this.eventPool?.add(payload);
  }

  programChanged(
    nowTime: number,
    programId?: string,
    programAssetId?: string
  ): void {
    if (!this.isActive()) {
      return;
    }
    this.logger.debug("programChanged", nowTime, programId);
    const payload = {
      EventType: REDBEE_ANALYTICS_EVENT.PROGRAM_CHANGED,
      ProgramId: programId,
      ProgramAssetId: programAssetId,
      ...this.getDefaultFields(nowTime),
    };
    this.eventPool?.add(payload);
  }

  error({
    message,
    currentTime,
    code,
    info,
    details,
    supportedDevice = true,
    deviceStats,
  }: {
    message: string;
    currentTime?: number;
    code?: number;
    info?: string;
    details?: string;
    supportedDevice?: boolean;
    deviceStats?: IDeviceStats;
  }): void {
    if (!this.isActive()) {
      return;
    }
    this.logger.debug("error", code, message);
    this.device.deviceStats = deviceStats;
    const payload = {
      EventType: REDBEE_ANALYTICS_EVENT.ERROR,
      AssetId: this.assetId,
      Message: message,
      Code: code,
      Info: info,
      Details: details,
      SupportedDevice: supportedDevice ? "yes" : "no",
      ...this.getDefaultFields(currentTime),
    };
    this.eventPool?.add(payload);
  }

  drmSessionUpdate(type: string): void {
    if (!this.isActive()) {
      return;
    }
    this.logger.debug("drmSessionUpdate", type);
    const payload = {
      EventType: REDBEE_ANALYTICS_EVENT.DRM_SESSION_UPDATED,
      Code: 0,
      Message: type,
      ...this.getDefaultFields(),
    };
    this.eventPool?.add(payload);
  }

  droppedFrames(droppedFrames: number): void {
    if (!this.isActive()) {
      return;
    }
    this.droppedFramesCount = droppedFrames;
  }

  updatePlayerFields(updates: Partial<IPlayerFields>) {
    this.playerFields = {
      ...this.playerFields,
      ...updates,
    };
  }

  getOffset(currentTime: number): number {
    return Math.floor(currentTime * 1000);
  }

  getDefaultFields(currentTime?: number) {
    return {
      Timestamp: Date.now(),
      DeviceId: this.deviceId,
      DeviceModel: this.device.model,
      DeviceModelNumber: this.device.modelNumber,
      DeviceStats: this.device.deviceStats,
      Manufacturer: this.device.manufacturer,
      AppType: this.device.appType,
      ...(this.device.appName && { AppName: this.device.appName }),
      PageUrl: this.device.pageUrl,
      Referrer: this.device.referrer,
      UserAgent: window.navigator ? window.navigator.userAgent : "",
      OS: this.device.os,
      OSVersion: this.device.osVersion,
      OffsetTime:
        currentTime && currentTime > 0
          ? this.getOffset(currentTime)
          : undefined,
      TotalNumberOfDroppedFrames: this.droppedFramesCount,
      ...this.playerFields,
    };
  }

  public destroy() {
    this.eventPool?.destroy();
    this.eventPool = undefined;
    this.clockOffsetProvider?.destroy();
    this.clockOffsetProvider = undefined;
    this.clear();
  }
}
// old analytics https://github.com/ericssonbroadcastservices/emp-analytics
