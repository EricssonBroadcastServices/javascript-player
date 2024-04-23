// SPDX-FileCopyrightText: 2024 Red Bee Media Ltd <https://www.redbeemedia.com/>
//
// SPDX-License-Identifier: MIT

import { MediaFormatType } from "@ericssonbroadcastservices/rbm-ott-sdk";

import { IRedBeeAnalyticsOptions, RedBeeAnalytics } from "../RedBeeAnalytics";

export interface IConnectorOptions extends IRedBeeAnalyticsOptions {
  playerName?: string;
  playerVersion?: string;
  debug?: boolean;
}

export abstract class BaseConnector {
  protected customer: string;
  protected businessUnit: string;
  protected analyticsBaseUrl: string;
  protected sessionToken?: string;
  protected playerName: string;
  protected playerVersion?: string;

  protected rbmAnalytics: RedBeeAnalytics;

  constructor({
    customer,
    businessUnit,
    analyticsBaseUrl,
    sessionToken,
    playerName = "javascript-player",
    playerVersion,
    device,
    debug = false,
  }: IConnectorOptions) {
    this.customer = customer;
    this.businessUnit = businessUnit;
    this.analyticsBaseUrl = analyticsBaseUrl;

    this.playerName = playerName;
    this.playerVersion = playerVersion;

    const rbmAnalytics = new RedBeeAnalytics({
      customer: this.customer,
      businessUnit: this.businessUnit,
      sessionToken,
      analyticsBaseUrl,
      device,
      debug,
    });
    this.rbmAnalytics = rbmAnalytics;
  }

  setAnalyticsBaseUrl(analyticsBaseUrl: string): void {
    this.analyticsBaseUrl = analyticsBaseUrl;
    this.rbmAnalytics.setAnalyticsBaseUrl(analyticsBaseUrl);
  }

  resolveFormatType(url: string): MediaFormatType | undefined {
    if (url.includes(".mpd")) {
      return "DASH";
    }
    if (url.includes(".m3u8")) {
      return "HLS";
    }
    if (url.includes(".ism")) {
      return "SMOOTHSTREAMING";
    }
    if (url.includes(".mp4")) {
      return "MP4";
    }
    if (url.includes(".mp3")) {
      return "MP3";
    }
    return undefined;
  }

  public abstract connect(playerInstance: any): void;
  public abstract disconnect(): void;

  public destroy() {
    this.rbmAnalytics?.destroy();
  }
}
