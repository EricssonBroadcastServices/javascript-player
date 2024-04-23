// SPDX-FileCopyrightText: 2024 Red Bee Media Ltd <https://www.redbeemedia.com/>
//
// SPDX-License-Identifier: MIT

import { Ads, MediaFormat } from "@ericssonbroadcastservices/rbm-ott-sdk";

import {
  IAdBlock,
  TrackingEvent,
} from "@ericssonbroadcastservices/js-player-shared";

import { StitcherEvent } from "../utils/constants";
import { parseVAST } from "../utils/vast";
import { AbstractAdsParser } from "./AbstractAdsParser";

export class NowtilusAdsParser extends AbstractAdsParser {
  private vastUrl?: string;
  private longPoll?: number;

  private vastStartTime?: number;

  constructor(format: MediaFormat, ads: Ads) {
    super();

    if (ads.clips) {
      this.clips = ads.clips;
      this.isLive = false;
    } else if (format.vastUrl) {
      this.vastUrl = format.vastUrl;
      this.isLive = true;
    }
  }

  public init() {
    if (!this.vastUrl && (!this.clips || !this.clips.length)) {
      console.warn("[Nowtilus] Can't monitor stream, no clips or vastUrl");
      return;
    }

    if (!this.isLive) {
      this.initVOD();
    } else if (this.vastUrl) {
      this.initLive();
    }
  }

  private initLive() {
    this.poll();
    this.longPoll = window.setInterval(async () => {
      this.poll();
    }, 5000);
  }

  private initVOD() {
    if (!this.clips) return;
    let time = 0;
    let adDuration = 0;
    let adBlock: IAdBlock | undefined;
    const adBlocks: IAdBlock[] = [];
    this.clips.forEach((clip, index) => {
      if (clip.category === "vod") {
        adBlock = undefined;
      } else {
        if (!adBlock) {
          adBlock = {
            startTime: time,
            endTime: time,
            duration: 0,
            relativeStartTime: time - adDuration,
            ads: [],
          };
          adBlocks.push(adBlock);
        }
        adBlock.endTime += clip.duration ?? 0;
        adBlock.duration += clip.duration ?? 0;
        adBlock.ads.push({
          id: `${time}_${index}_${clip.titleId}`,
          title: clip.title ?? "",
          duration: clip.duration ?? 0,
          system: "",
          trackingEvents: {
            [TrackingEvent.IMPRESSION]: [
              ...(clip.impressionUrlTemplates ?? []),
            ],
            [TrackingEvent.CLICK_THROUGH]: [
              ...(clip.videoClicks?.clickTrackingUrls ?? []),
            ],
            ...(clip.trackingEvents ?? []),
          },
          clickThrough: clip.videoClicks?.clickThroughUrl,
        });
        adDuration += clip.duration ?? 0;
      }
      time += clip.duration ?? 0;
    });
    adBlocks.forEach((adBlock) => {
      this.emit(StitcherEvent.ADBLOCK, adBlock);
    });
  }

  private async poll() {
    if (!this.vastUrl) {
      return console.error("vastUrl not defined");
    }
    try {
      const response = await fetch(this.vastUrl, {
        headers: {
          accept: "application/json",
        },
      });
      if (!response.ok)
        throw new Error(
          "[Nowtilus] something went wrong when fetching the VAST JSON"
        );
      if (response.status !== 200) {
        return;
      }
      const data = await response.json();
      if (!data.time) {
        throw new Error("[Nowtilus] VAST response invalid, no time availble");
      }
      if (data.time === this.vastStartTime) {
        // the adblock has already been handled
        return;
      }
      const ads = parseVAST(data.vast, data.time.toString());
      this.vastStartTime = data.time;
      const adBlock: IAdBlock = {
        startTime: data.time,
        duration: ads.reduce((duration, ad) => duration + ad.duration, 0),
        relativeStartTime: data.time,
        endTime: ads.reduce(
          (endTime: number, ad) => endTime + ad.duration,
          data.time
        ),
        ads,
      };
      this.emit(StitcherEvent.ADBLOCK, adBlock);
    } catch (error) {
      console.error(
        "[Nowtilus] something went wrong when fetching the vast",
        error
      );
    }
  }

  public destroy() {
    super.destroy();
    clearInterval(this.longPoll);
  }
}
