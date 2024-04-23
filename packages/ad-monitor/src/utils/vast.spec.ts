// SPDX-FileCopyrightText: 2024 Red Bee Media Ltd <https://www.redbeemedia.com/>
//
// SPDX-License-Identifier: MIT

import { nowtilusXml } from "./__fixtures__/vastXml";
import { parseVAST } from "./vast";

describe("vast", () => {
  describe("parseVAST()", () => {
    const ads = parseVAST(nowtilusXml);
    const firstAd = ads[0];

    it("returns the correct number of ads", () => {
      expect(ads.length).toBe(4);
    });
    it("the first ad metadata is correct", () => {
      expect(firstAd.id).toBe("_0_AdswizzAd2452136770");
      expect(firstAd.title).toBe("TMW/WWPG017/010 - Desktop");
      expect(firstAd.duration).toBe(10000);
    });
    it("the number of trackingEvents are correct for the first ad", () => {
      expect(firstAd.trackingEvents.impression?.length).toBe(5);
      expect(firstAd.trackingEvents.start?.length).toBe(2);
      expect(firstAd.trackingEvents.firstQuartile?.length).toBe(2);
      expect(firstAd.trackingEvents.midpoint?.length).toBe(2);
      expect(firstAd.trackingEvents.thirdQuartile?.length).toBe(2);
      expect(firstAd.trackingEvents.complete?.length).toBe(2);
    });
    it("the trackingEvents for all ads are correctly parsed", () => {
      ads.forEach((ad) => {
        (
          [
            "impression",
            "start",
            "firstQuartile",
            "midpoint",
            "thirdQuartile",
            "complete",
          ] as const
        ).forEach((type) => {
          const evt = ad.trackingEvents[type];
          if (evt) {
            /* eslint-disable jest/no-conditional-expect */
            expect(evt).toEqual(expect.any(Array));
            evt.forEach((event) => {
              expect(event).toEqual(expect.stringContaining("http"));
            });
          }
        });
      });
    });
  });
});
