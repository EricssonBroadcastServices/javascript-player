// SPDX-FileCopyrightText: 2024 Red Bee Media Ltd <https://www.redbeemedia.com/>
//
// SPDX-License-Identifier: MIT

import type { PlayerCore } from "@ericssonbroadcastservices/js-player-core";
import {
  CorePlayerEventsMap,
  PlayerEvents,
} from "@ericssonbroadcastservices/js-player-shared";
import { AllEvent } from "@ericssonbroadcastservices/js-player-shared/src/EmitterBaseClass";

import { getDeviceStats } from "../utils/helpers";
import { BaseConnector, IConnectorOptions } from "./BaseConnector";

function bpsTokbps(bitrate: number) {
  if (bitrate < 0) {
    return undefined;
  }
  return bitrate / 1000;
}

export class PlayerCoreConnector extends BaseConnector {
  private playerInstance?: PlayerCore;

  private beat?: ReturnType<typeof setInterval>;
  private beatInterval = 10_000;

  private currentTime?: number;
  private sessionEnded?: boolean;

  private analyticsEnabled = true;

  private isBrowserSupported?: boolean;

  constructor({
    customer,
    businessUnit,
    analyticsBaseUrl,
    sessionToken,
    playerName,
    playerVersion,
    device,
    debug,
  }: IConnectorOptions) {
    super({
      customer,
      businessUnit,
      analyticsBaseUrl,
      sessionToken,
      playerName,
      playerVersion,
      device,
      debug,
    });

    this.onPlayerEvents = this.onPlayerEvents.bind(this);
  }

  connect(playerInstance: PlayerCore): void {
    this.playerInstance = playerInstance;

    this.currentTime = 0;
    this.sessionEnded = false;
    this.isBrowserSupported = playerInstance.isBrowserSupported();

    this.playerInstance.onAll(this.onPlayerEvents);
  }

  disconnect(): void {
    this.disableHeartbeat();
    this.sessionEnded = true;
  }

  private onPlayerEvents({ event, data }: AllEvent<CorePlayerEventsMap>) {
    if (this.sessionEnded || !this.analyticsEnabled || !this.playerInstance) {
      return;
    }

    if (data && "currentTime" in data) {
      this.currentTime = data.currentTime;
    }

    switch (event) {
      case PlayerEvents.LOADING: {
        const { playerVersion } = this.playerInstance.getPlayerInfo();
        const sessionInfo = this.playerInstance.getSession();
        const postInterval = sessionInfo.analyticsPostInterval
          ? sessionInfo.analyticsPostInterval * 1000
          : this.beatInterval;

        if (sessionInfo.analyticsBaseUrl) {
          this.setAnalyticsBaseUrl(sessionInfo.analyticsBaseUrl);
        }

        this.analyticsEnabled = sessionInfo.analyticsPercentage
          ? sessionInfo.analyticsPercentage > Math.random() * 100
          : true;

        if (!this.analyticsEnabled) {
          return;
        }

        if (postInterval > this.beatInterval) {
          this.beatInterval = postInterval;
        }

        this.rbmAnalytics.init(data.playSessionId);
        this.rbmAnalytics.created({
          player: this.playerName,
          playerVersion: this.playerVersion || playerVersion,
          streamingTechnology: sessionInfo.playbackFormat,
          assetId: sessionInfo.assetId,
          autoplay: sessionInfo.autoplay,
          requestId: sessionInfo.requestId,
          cdnProvider: sessionInfo.cdnProvider,
          analyticsPostInterval: sessionInfo.analyticsPostInterval,
          analyticsBucket: sessionInfo.analyticsBucket,
          analyticsTag: sessionInfo.analyticsTag,
          analyticsPercentage: sessionInfo.analyticsPercentage,
          analyticsBaseUrl: sessionInfo.analyticsBaseUrl || "",
          exposureBaseUrl: sessionInfo.exposureBaseUrl,
          deviceStats: getDeviceStats(),
        });
        this.rbmAnalytics.assetLoaded({ assetId: sessionInfo.assetId });
        break;
      }
      case PlayerEvents.LOADED: {
        const { playerEngine } = this.playerInstance.getPlayerInfo();
        this.rbmAnalytics.playerReady({
          startTime: data.startTime,
          playerTech: playerEngine.name || "",
          techVersion: playerEngine.version,
        });
        break;
      }
      case PlayerEvents.DRM_UPDATE:
        this.rbmAnalytics.drmSessionUpdate(data.type);
        break;
      case PlayerEvents.START: {
        this.rbmAnalytics.playing({
          bitrate: bpsTokbps(data.bitrate),
          duration: data.duration,
          mediaLocator: data.source,
        });
        this.initHeartbeat();
        break;
      }
      case PlayerEvents.PAUSE:
        this.rbmAnalytics.paused(this.currentTime);
        break;
      case PlayerEvents.SEEKED:
        this.rbmAnalytics.seeked(this.currentTime);
        break;
      case PlayerEvents.RESUME:
        this.rbmAnalytics.resume(this.currentTime);
        this.initHeartbeat();
        break;
      case PlayerEvents.BUFFERING:
        this.rbmAnalytics.buffering(this.currentTime);
        break;
      case PlayerEvents.BUFFERED:
        this.rbmAnalytics.buffered(this.currentTime);
        break;
      case PlayerEvents.BITRATE_CHANGED:
        this.rbmAnalytics.bitrateChanged(
          this.currentTime,
          bpsTokbps(data.bitrate)
        );
        break;
      case PlayerEvents.ENDED:
        this.rbmAnalytics.mediaEnded(this.currentTime);
        this.disconnect();
        break;
      case PlayerEvents.STOP:
        this.rbmAnalytics.dispose(this.currentTime);
        this.disconnect();
        break;
      case PlayerEvents.ERROR: {
        const { code = 500, rawError } = data?.metadata || {};
        const message = data?.toString();
        let details: string | undefined;
        if (rawError) {
          try {
            details = JSON.stringify(rawError, null, 2);
          } catch (err) {}
        }
        this.rbmAnalytics.error({
          currentTime: this.currentTime,
          message,
          code,
          details,
          supportedDevice: this.isBrowserSupported,
          deviceStats: getDeviceStats(),
        });
        this.disconnect();
        break;
      }
      case PlayerEvents.AIRPLAY_START:
        this.rbmAnalytics.startAirPlay();
        break;
      case PlayerEvents.AIRPLAY_STOP:
        this.rbmAnalytics.stopAirPlay();
        break;
      case PlayerEvents.AD_START:
        this.rbmAnalytics.adStarted(this.currentTime, data.id);
        break;
      case PlayerEvents.AD_COMPLETE:
        this.rbmAnalytics.adCompleted(this.currentTime, data.id);
        break;
      case PlayerEvents.DROPPED_FRAMES:
        this.rbmAnalytics.droppedFrames(data.droppedFrames);
        break;
      case PlayerEvents.PROGRAM_CHANGED: {
        const program = data.program;
        if (!program) {
          return;
        }
        let programId: string | undefined;
        let programAssetId: string | undefined;
        if ("programId" in program) {
          programId = program.programId;
        }
        if ("asset" in program) {
          programAssetId = program.asset.assetId;
        }
        this.rbmAnalytics.programChanged(
          this.currentTime ?? 0,
          programId,
          programAssetId
        );
        break;
      }
      default:
        break;
    }
  }

  private initHeartbeat() {
    if (this.beat) return;
    this.beat = setInterval(() => {
      this.rbmAnalytics.heartbeat(this.currentTime);
    }, this.beatInterval);
  }

  private disableHeartbeat() {
    if (!this.beat) return;
    clearInterval(this.beat);
    this.beat = undefined;
  }

  public destroy() {
    this.playerInstance?.offAll(this.onPlayerEvents);
    this.disableHeartbeat();
    super.destroy();
  }
}
