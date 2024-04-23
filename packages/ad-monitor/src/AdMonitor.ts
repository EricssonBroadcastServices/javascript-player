// SPDX-FileCopyrightText: 2024 Red Bee Media Ltd <https://www.redbeemedia.com/>
//
// SPDX-License-Identifier: MIT

import {
  AdStitcher,
  Ads,
  MediaFormat,
} from "@ericssonbroadcastservices/rbm-ott-sdk";

import {
  EmitterBaseClass,
  IAdBlock,
  IAdDataRepresentation,
  TrackingEvent,
} from "@ericssonbroadcastservices/js-player-shared";

import { AbstractAdsParser } from "./parsers/AbstractAdsParser";
import { InternalAdsParser } from "./parsers/InternalAdsParser";
import { NowtilusAdsParser } from "./parsers/NowtilusAdsParser";
import {
  AdMonitorEvent,
  AdMonitorEventMap,
  StitcherEvent,
  TrackingCuePoints,
} from "./utils/constants";

// How many ms between time updates until an ad is no longer considered playing linearly
const LINEAR_AD_THRESHOLD = 2000;

/**
 * AdMonitor
 * The monitor is responsible for monitoring the stream and report back about
 * what ad related activity is going on in the stream given the current time.
 * It is also reponsible of sending any necessary tracking events for running ads.
 */
export class AdMonitor extends EmitterBaseClass<AdMonitorEventMap> {
  private format: MediaFormat;
  private ads: Ads;
  private adStitchEngine?: AbstractAdsParser;

  private adBlocks: IAdBlock[] = [];

  private currentAd?: IAdDataRepresentation;
  private currentAdBlock?: IAdBlock;

  private trackedAds: {
    [adId: string]: {
      [key: string]: true;
    };
  } = {};

  constructor(format: MediaFormat, ads: Ads) {
    super();
    this.format = format;
    this.ads = ads;

    this.adStitchEngine = this.resolveEngine(ads.stitcher);
    if (!this.adStitchEngine) {
      console.warn(
        ads.stitcher
          ? `[AdMonitor] Stitcher: ${ads.stitcher} is not supported`
          : "[AdMonitor] Stitcher is not defined"
      );
      return;
    }

    this.adStitchEngine.on(StitcherEvent.ADBLOCK, (adBlock: IAdBlock) =>
      this.addAdBlock(adBlock)
    );
    this.adStitchEngine.init();
  }

  private resolveEngine(
    adStitchProvider: AdStitcher
  ): AbstractAdsParser | undefined {
    switch (adStitchProvider) {
      case "NOWTILUS":
        return new NowtilusAdsParser(this.format, this.ads);
      case "INTERNAL":
        return new InternalAdsParser(this.ads.clips);
      default:
        break;
    }
  }

  public handleTimeUpdate({
    utcCurrentTime,
    currentTime,
  }: {
    utcCurrentTime: number;
    currentTime: number;
  }) {
    if (!this.adStitchEngine || !this.adBlocks.length) {
      return;
    }

    const currentTimeMs = this.adStitchEngine.isTimeUTC()
      ? utcCurrentTime
      : currentTime * 1000;

    // check if an adblock has started
    if (!this.currentAdBlock) {
      const adBlock = this.adBlocks.find(
        (adBlock) =>
          currentTimeMs >= adBlock.startTime && currentTimeMs < adBlock.endTime
      );
      if (!adBlock) {
        return;
      }

      this.currentAdBlock = adBlock;
      this.emit(AdMonitorEvent.ADBLOCK_START, { ...this.currentAdBlock });
    }

    const currentAdBlock = this.currentAdBlock;

    let durationAccuracy = 0;
    // get the ads stored from the vast response
    const ads: IAdDataRepresentation[] = this.currentAdBlock.ads;
    ads.forEach((ad) => {
      // calculate when the ad starts and stops in relation to the vast response time
      const adStartTime = currentAdBlock.startTime + durationAccuracy;
      const adEndTime =
        currentAdBlock.startTime + durationAccuracy + ad.duration;

      durationAccuracy += ad.duration;
      // if current time is within ad start and ad end, it's an ongoing ad
      if (currentTimeMs >= adStartTime && currentTimeMs < adEndTime) {
        const remainingTime = adEndTime - currentTimeMs;
        const percentWatched = Math.round(
          100 - (100 * remainingTime) / ad.duration
        );

        // report end of the current ad ( if any ) and report start of the new one
        if (this.currentAd?.id !== ad.id) {
          if (this.currentAd) {
            this.emit(AdMonitorEvent.AD_END, { ...this.currentAd });
            this.trackEvent(this.currentAd, TrackingEvent.COMPLETE);
          }
          this.currentAd = ad;
          const adIndex = ads.indexOf(ad) + 1;
          const adsTotal = ads.length;
          this.emit(AdMonitorEvent.AD_START, {
            ...ad,
            adIndex,
            adsTotal,
          });
          this.trackEvent(ad, TrackingEvent.LOADED);
          this.trackEvent(ad, TrackingEvent.START);
          this.trackEvent(ad, TrackingEvent.IMPRESSION);
        }

        Object.keys(TrackingCuePoints).map((value) => {
          const event: TrackingEvent =
            TrackingCuePoints[value as unknown as number];
          if (percentWatched > parseInt(value, 10)) {
            this.trackEvent(ad, event);
          }
        });
      }
    });

    // Check if the adblock has ended
    if (currentTimeMs > Math.floor(currentAdBlock.endTime)) {
      const isEndingLinear =
        currentTimeMs - this.currentAdBlock.endTime < LINEAR_AD_THRESHOLD;
      if (this.currentAd && isEndingLinear) {
        this.emit(AdMonitorEvent.AD_END, { ...this.currentAd });
        this.trackEvent(this.currentAd, TrackingEvent.COMPLETE);
      }
      // TODO: is there a scenario where `this.currentAdBlock` is undefined here?
      // should we only emit ADBLOCK_END if we have an adblock ending...
      this.emit(AdMonitorEvent.ADBLOCK_END, { ...this.currentAdBlock });
      this.currentAdBlock = undefined;
      this.currentAd = undefined;
    }
  }

  handleEnded() {
    if (this.currentAd) {
      this.emit(AdMonitorEvent.AD_END, { ...this.currentAd });
      this.trackEvent(this.currentAd, TrackingEvent.COMPLETE);
    }
    this.emit(
      AdMonitorEvent.ADBLOCK_END,
      this.currentAdBlock ? { ...this.currentAdBlock } : undefined
    );
    this.currentAdBlock = undefined;
    this.currentAd = undefined;
  }

  private trackEvent(ad: IAdDataRepresentation, trackingEvent: TrackingEvent) {
    if (
      !ad ||
      !trackingEvent ||
      (this.trackedAds[ad.id] && this.trackedAds[ad.id][trackingEvent] === true)
    ) {
      return;
    }

    if (!this.trackedAds[ad.id]) {
      this.trackedAds[ad.id] = {};
    }

    const trackingUrls = ad.trackingEvents[trackingEvent];
    trackingUrls?.forEach(async (url: string) => {
      // send and forget
      new Image().src = url;
    });

    this.trackedAds[ad.id][trackingEvent] = true;
  }

  public getAdBlocks() {
    return this.adBlocks;
  }

  private addAdBlock(adBlock: IAdBlock) {
    if (
      !adBlock.ads.length ||
      this.adBlocks.find((block) => block.startTime === adBlock.startTime)
    ) {
      return;
    }
    this.adBlocks.push(adBlock);
    this.emit(AdMonitorEvent.ADBLOCK_ADDED, adBlock);
  }

  public destroy() {
    super.destroy();
    this.adStitchEngine?.destroy();
    this.adStitchEngine = undefined;
    this.currentAd = undefined;
    this.currentAdBlock = undefined;
  }
}
