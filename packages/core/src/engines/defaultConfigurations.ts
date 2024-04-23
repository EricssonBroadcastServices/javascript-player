// SPDX-FileCopyrightText: 2024 Red Bee Media Ltd <https://www.redbeemedia.com/>
//
// SPDX-License-Identifier: MIT

import dashjs from "dashjs";
import { HlsConfig } from "hls.js";

import { isLGTV } from "../device/common";

export const HlsJs: Partial<HlsConfig> = {
  autoStartLoad: false,
  // Error related
  manifestLoadingTimeOut: 10e3,
  levelLoadingTimeOut: 10e3,
  fragLoadingTimeOut: 10e3,
  manifestLoadingMaxRetry: 3,
  levelLoadingMaxRetry: 3,
  fragLoadingMaxRetry: 3,
  // Performance related
  capLevelToPlayerSize: true,
  capLevelOnFPSDrop: true,
  fpsDroppedMonitoringPeriod: 1000,
  fpsDroppedMonitoringThreshold: 0.2,
  // Live
  liveDurationInfinity: true,
  // ABR
  startLevel: -1, // auto detect startLevel,
};

export const Shaka = {
  abr: {
    // Downgrade if more than 85% of bandwidth estimate is used
    bandwidthDowngradeTarget: 0.85,
    // Upgrade if it would use less than 75% of the estimated bandwidth
    bandwidthUpgradeTarget: 0.75,
    switchInterval: 2,
  },
  streaming: {
    rebufferingGoal: 6,
    bufferingGoal: 120,
    bufferBehind: 30,
    ignoreTextStreamFailures: true,
    startAtSegmentBoundary: false,
    retryParameters: {
      maxAttempts: 6,
      baseDelay: 2000,
      backoffFactor: 2,
      fuzzFactor: 0.5,
      timeout: 300000, // 5 minutes timeout, default is 30 seconds
      stallTimeout: 10000, // 10 seconds, default is 5 seconds
      connectionTimeout: 60000, // 1 minute, default is 10 seconds
    },
  },
  manifest: {
    retryParameters: {
      maxAttempts: 6,
      baseDelay: 2000,
      backoffFactor: 2,
      fuzzFactor: 0.5,
    },
  },
};

export const ShakaLive = {
  manifest: {
    defaultPresentationDelay: 0, // 0 basically means use the minBufferTime * 1.5
  },
};

export const DashJsDefaults: dashjs.MediaPlayerSettingClass = {
  streaming: {
    timeShiftBuffer: {
      calcFromSegmentTimeline: true,
    },
    gaps: {
      jumpGaps: true,
    },
    buffer: {
      fastSwitchEnabled: true,
      reuseExistingSourceBuffers: !isLGTV(),
    },
    abr: {
      limitBitrateByPortal: true,
      usePixelRatioInLimitBitrateByPortal: true,
    },
  },
};

export const DashJsLowLatency: dashjs.MediaPlayerSettingClass = {
  streaming: {
    liveCatchup: {
      enabled: true,
      // The default mode has one goal - keep the latency as close to the target as possible
      // liveCatchupModeLoLP considers the buffer level and will try to keep the latency at target without stalling.
      mode: "liveCatchupModeLoLP",
      playbackRate: {
        min: 0,
        max: 0.5,
      },
    },
  },
};
