// SPDX-FileCopyrightText: 2024 Red Bee Media Ltd <https://www.redbeemedia.com/>
//
// SPDX-License-Identifier: MIT

import { IAdBlock } from "@ericssonbroadcastservices/js-player-shared";

import { StitcherEvent } from "../utils/constants";
import { AbstractAdsParser } from "./AbstractAdsParser";

export class InternalAdsParser extends AbstractAdsParser {
  public init() {
    if (!this.clips?.length) {
      console.warn("[InternalAdsStitcher] No ad clip data available.");
      return;
    }

    let time = 0;
    let adDuration = 0;
    const adBlocks: IAdBlock[] = [];
    this.clips.forEach(({ category, duration = 0, title = "" }, index) => {
      if (category === "ad") {
        // Merge consequent clips of ads into one ad block
        // Only create block for the first in the sequence only, then push all the clips to it
        if (this.clips[index - 1]?.category !== "ad") {
          adBlocks.push({
            startTime: time,
            endTime: time,
            duration: 0,
            relativeStartTime: time - adDuration,
            ads: [],
          });
        }

        // Get current (last) block. It will always exist, but need condition because typescript doesn't know
        const adBlock = adBlocks.at(-1);
        if (adBlock) {
          adBlock.endTime += duration;
          adBlock.duration += duration;
          adBlock.ads.push({
            id: `${time}_${index}`,
            title,
            duration,
            system: "",
            trackingEvents: {},
          });
        }

        adDuration += duration;
      }
      time += duration;
    });
    adBlocks.forEach((adBlock) => {
      this.emit(StitcherEvent.ADBLOCK, adBlock);
    });
  }
}
