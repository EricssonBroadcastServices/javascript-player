// SPDX-FileCopyrightText: 2024 Red Bee Media Ltd <https://www.redbeemedia.com/>
//
// SPDX-License-Identifier: MIT

import { getTimeAnonymous } from "@ericssonbroadcastservices/rbm-ott-sdk";

const SYNC_INTERVAL_MS = 30 * 60 * 1000; // 30 minutes
const MAX_INITIAL_SYNC_RETRIES = 3;
const RETRY_SYNC_INTERVAL_MS = 500;

export class ClockOffsetProvider {
  private exposureBaseUrl?: string;

  private clockInterval?: ReturnType<typeof setInterval>;
  private lastSyncLocalTime = 0;
  private lastSyncBrowserTime = 0;
  private clockOffset = 0;
  private isInitSyncing = false;

  // When exposoreBaseUrl is provided, clock offsets are calculated as the difference between Date.now() (LocalTime)
  // and server time, as follows: ServerTime = LocalTime - ClockOffset
  // If exposureBaseUrl is undefined, the calculated clock offsets will be relative to navigation time.
  // Navigation time equals to performance.timeOrigin + performance.now(), a time that is not impacted
  // by system and user clock adjustments, clock skew, etc
  constructor(exposureBaseUrl?: string) {
    this.exposureBaseUrl = exposureBaseUrl;

    if (exposureBaseUrl) {
      this.setupPeriodicalSync();
    } else {
      this.lastSyncBrowserTime = performance.now();
      this.lastSyncLocalTime = Date.now();
      this.clockOffset = 0;
    }
  }

  private async setupPeriodicalSync() {
    if (this.clockInterval) return;
    this.isInitSyncing = true;
    let attempts = 0;
    while (attempts < MAX_INITIAL_SYNC_RETRIES) {
      if (await this.updateClockOffset()) {
        break;
      }
      attempts++;
      await this.sleep(RETRY_SYNC_INTERVAL_MS);
    }
    this.isInitSyncing = false;

    if (attempts === MAX_INITIAL_SYNC_RETRIES) {
      // initial sync failed, continue with navigation time as reference
      return;
    }

    this.clockInterval = setInterval(() => {
      this.updateClockOffset();
    }, SYNC_INTERVAL_MS);
  }

  async getClockOffset(): Promise<number> {
    // wait for the initial syncing, if any, to finish
    while (this.isInitSyncing) {
      await this.sleep(RETRY_SYNC_INTERVAL_MS / 3);
    }
    const elapsedLocalTime = Date.now() - this.lastSyncLocalTime;
    const elapsedBrowserTime = performance.now() - this.lastSyncBrowserTime;
    const currentClockOffset = Math.round(
      this.clockOffset + (elapsedLocalTime - elapsedBrowserTime)
    );
    return currentClockOffset;
  }

  // Not used, but may be handy in the future
  async now() {
    return Date.now() - (await this.getClockOffset());
  }

  private async updateClockOffset(): Promise<boolean | void> {
    if (!this.exposureBaseUrl) return;
    this.lastSyncBrowserTime = performance.now();
    this.lastSyncLocalTime = Date.now();
    return getTimeAnonymous
      .call({
        baseUrl: this.exposureBaseUrl,
      })
      .then((resp) => {
        let lastSyncServerTime = resp.epochMillis;
        const roundTripTime = performance.now() - this.lastSyncBrowserTime;
        lastSyncServerTime -= Math.round(0.5 * roundTripTime);
        this.lastSyncLocalTime += Math.round(0.5 * roundTripTime);
        this.lastSyncBrowserTime += 0.5 * roundTripTime;
        this.clockOffset = this.lastSyncLocalTime - lastSyncServerTime;
        return true;
      })
      .catch(() => {
        return false;
      });
  }

  private sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  destroy() {
    if (!this.clockInterval) return;
    clearInterval(this.clockInterval);
    this.clockInterval = undefined;
  }
}
