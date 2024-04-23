// SPDX-FileCopyrightText: 2024 Red Bee Media Ltd <https://www.redbeemedia.com/>
//
// SPDX-License-Identifier: MIT

import type { PlayerManager } from "chromecast-caf-receiver/cast.framework";
import type {
  BitrateChangedEvent,
  BufferingEvent,
  ErrorEvent,
  Event,
} from "chromecast-caf-receiver/cast.framework.events";
import platform from "platform";

import {
  AdMonitor,
  AdMonitorEvent,
} from "@ericssonbroadcastservices/js-player-ad-monitor";

import { IDeviceInfo } from "../RedBeeAnalytics";
import { getDeviceStats } from "../utils/helpers";
import { BaseConnector } from "./BaseConnector";

interface ICastSession {
  playSessionId: string;
  requestId: string;
  assetId: string;
}

interface ICastConnectorOptions {
  customer: string;
  businessUnit: string;
  exposureBaseUrl: string;
  analyticsBaseUrl: string;
  sessionToken: string;
  playerVersion?: string;
  debug?: boolean;
  deviceInfo?: IDeviceInfo;
}

export class CastConnector extends BaseConnector {
  private playerManager?: PlayerManager;
  private adMonitor?: AdMonitor;

  private exposureBaseUrl: string;

  private beat?: ReturnType<typeof setInterval>;
  private beatInterval = 10_000;
  private defaultPostInterval = 30_000;

  private sessionStarted = false;

  private session: ICastSession;

  private onEventHandler?: (event: Event) => void;

  constructor(
    {
      customer,
      businessUnit,
      exposureBaseUrl,
      analyticsBaseUrl,
      sessionToken,
      playerVersion,
      deviceInfo,
      debug,
    }: ICastConnectorOptions,
    session: ICastSession
  ) {
    super({
      customer,
      businessUnit,
      analyticsBaseUrl,
      sessionToken,
      playerName: "cast-receiver",
      playerVersion,
      debug,
      device: {
        os: platform.os?.family ?? "unknown",
        osVersion: platform.os?.version ?? "unknown",
        model: "cc-unknown",
        manufacturer: "Google",
        appType: "chromecast",
        ...deviceInfo,
      },
    });

    this.session = session;
    this.exposureBaseUrl = exposureBaseUrl;
  }

  connect(playerManager: PlayerManager, adMonitor?: AdMonitor): void {
    this.playerManager = playerManager;
    this.adMonitor = adMonitor;

    this.setupEventListeners();

    const { assetId, requestId, playSessionId } = this.session;

    const playbackUrl = playerManager?.getMediaInformation()?.contentUrl;
    const format = playbackUrl ? this.resolveFormatType(playbackUrl) : "";

    this.rbmAnalytics.init(playSessionId);
    this.rbmAnalytics.created({
      player: this.playerName,
      playerVersion: this.playerVersion,
      streamingTechnology: format,
      analyticsPostInterval: this.defaultPostInterval,
      exposureBaseUrl: this.exposureBaseUrl,
      assetId,
      autoplay: true,
      requestId,
      deviceStats: getDeviceStats(),
    });
    this.rbmAnalytics.assetLoaded({ assetId });
  }

  disconnect(): void {
    this.disableHeartbeat();
    if (this.onEventHandler) {
      this.playerManager?.removeEventListener(
        (cast.framework as any).events.EventType.ALL,
        this.onEventHandler
      );
      this.onEventHandler = undefined;
    }
  }

  private setupEventListeners() {
    this.playerManager?.addEventListener(
      (cast.framework as any).events.EventType.ALL,
      (this.onEventHandler = (event: Event) => {
        // @todo: this shouldn't be needed when disconnect method is working as intended
        if (!this.rbmAnalytics || !this.playerManager) {
          return;
        }
        const EventType = (cast.framework as any).events.EventType;
        const currentTime = this.playerManager.getCurrentTimeSec();
        const stats = this.playerManager.getStats();

        switch (event.type) {
          case EventType.PLAYING: {
            if (!this.sessionStarted) {
              this.sessionStarted = true;
              this.rbmAnalytics.playerReady({
                startTime: currentTime,
                playerTech: "CAF Receiver",
                techVersion: cast.framework.VERSION,
              });
              this.rbmAnalytics.playing({
                duration: this.playerManager.getDurationSec(),
                mediaLocator:
                  this.playerManager.getMediaInformation()?.contentUrl ?? "",
                bitrate: stats.streamBandwidth
                  ? stats.streamBandwidth / 1000
                  : 0,
              });
              this.initHeartbeat();
            } else {
              this.rbmAnalytics.resume(currentTime);
              this.initHeartbeat();
            }
            break;
          }
          case EventType.PAUSE:
            this.rbmAnalytics.paused(currentTime);
            break;
          case EventType.SEEKED:
            this.rbmAnalytics.seeked(currentTime);
            break;
          case EventType.BUFFERING: {
            const bufferingEvent = event as BufferingEvent;
            if (bufferingEvent.isBuffering) {
              this.rbmAnalytics.buffering(currentTime);
            } else {
              this.rbmAnalytics.buffered(currentTime);
            }
            break;
          }
          case EventType.BITRATE_CHANGED: {
            const { totalBitrate } = event as BitrateChangedEvent;
            this.rbmAnalytics.bitrateChanged(
              currentTime,
              totalBitrate ? totalBitrate / 1000 : 0
            );
            break;
          }
          case EventType.ENDED:
            this.rbmAnalytics.mediaEnded(currentTime);
            this.disconnect();
            break;
          case EventType.REQUEST_STOP:
            this.rbmAnalytics.dispose(currentTime);
            this.disconnect();
            break;
          case EventType.ERROR: {
            const errorEvent = event as ErrorEvent;
            const error = errorEvent.error;
            this.rbmAnalytics.error({
              currentTime,
              code: error?.shakaErrorCode ?? errorEvent.detailedErrorCode,
              message: error?.shakaErrorData
                ? error.shakaErrorData.join(",")
                : errorEvent.reason,
              deviceStats: getDeviceStats(),
            });
            this.disconnect();
            break;
          }
          default:
            break;
        }
      })
    );

    this.adMonitor?.on(AdMonitorEvent.AD_START, ({ id }: { id: string }) => {
      this.rbmAnalytics.adStarted(this.playerManager?.getCurrentTimeSec(), id);
    });
    this.adMonitor?.on(AdMonitorEvent.AD_END, ({ id }: { id: string }) => {
      this.rbmAnalytics.adCompleted(
        this.playerManager?.getCurrentTimeSec(),
        id
      );
    });
  }

  private initHeartbeat() {
    if (this.beat) {
      return;
    }
    this.beat = setInterval(() => {
      this.rbmAnalytics.heartbeat(this.playerManager?.getCurrentTimeSec());
    }, this.beatInterval);
  }

  private disableHeartbeat() {
    if (!this.beat) {
      return;
    }
    clearInterval(this.beat);
    this.beat = undefined;
  }

  public destroy() {
    this.rbmAnalytics?.dispose();
    this.disconnect();
    super.destroy();
  }
}
