// SPDX-FileCopyrightText: 2024 Red Bee Media Ltd <https://www.redbeemedia.com/>
//
// SPDX-License-Identifier: MIT

import {
  getDeviceRestrictions,
  getResolutionAndBitrateRestrictions,
} from "./restrictions";

function mockLG({ uhd }: { uhd: boolean }) {
  (window as any).webOS = {
    platform: {
      tv: true,
    },
    deviceInfo: (cb: any) => {
      cb({
        uhd,
      });
    },
  };
}

function cleanup() {
  (window as any).webOS = undefined;
}

describe("engines > utils > restrictions", () => {
  describe("getDeviceRestrictions", () => {
    describe("lg", () => {
      afterEach(() => cleanup());
      it("sets no restrictions when uhd is supported", async () => {
        mockLG({ uhd: true });
        await expect(getDeviceRestrictions()).resolves.toEqual({});
      });
      it("limits maxResHeight 1080 when uhd is not supported", async () => {
        mockLG({ uhd: false });
        await expect(getDeviceRestrictions()).resolves.toEqual({
          maxResHeight: 1080,
        });
      });
    });
  });
  describe("getResolutionAndBitrateRestrictions", () => {
    afterEach(() => cleanup());
    it("works without contractRestrictions", async () => {
      await expect(getResolutionAndBitrateRestrictions()).resolves.toEqual({});
    });

    it("returns the contractRestrictions when no device restrictions exist", async () => {
      await expect(
        getResolutionAndBitrateRestrictions({
          maxResHeight: 1,
          maxBitrate: 2,
          minBitrate: 3,
        })
      ).resolves.toEqual({
        maxResHeight: 1,
        maxBitrate: 2,
        minBitrate: 3,
      });
    });

    it("overrides the contractRestrictions when the device restrictions are harder", async () => {
      mockLG({ uhd: false });
      await expect(
        getResolutionAndBitrateRestrictions({
          maxResHeight: 1440,
        })
      ).resolves.toEqual({
        maxResHeight: 1080,
      });
    });

    it("uses the contractRestrictions when they are harder", async () => {
      mockLG({ uhd: false });
      await expect(
        getResolutionAndBitrateRestrictions({
          maxResHeight: 720,
        })
      ).resolves.toEqual({
        maxResHeight: 720,
      });
    });
  });
});
