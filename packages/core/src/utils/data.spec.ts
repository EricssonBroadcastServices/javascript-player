// SPDX-FileCopyrightText: 2024 Red Bee Media Ltd <https://www.redbeemedia.com/>
//
// SPDX-License-Identifier: MIT

import { PlayResponse } from "@ericssonbroadcastservices/rbm-ott-sdk";

import { getStartTime } from "./data";

describe("data", () => {
  describe("getStartTime", () => {
    const playResponse = {
      streamInfo: {
        event: false,
        live: true,
        static: false,
      },
      playSessionId: "xyz123",
      requestId: "xyz123",
      formats: [],
      contractRestrictions: {},
      durationInMs: Infinity,
      durationInMilliseconds: Infinity,
    };
    it("Should respond with undefined for Live", () => {
      const startTime = getStartTime(playResponse as unknown as PlayResponse);
      expect(startTime).toBe(undefined);
    });
    it("Should respond with the bookmark position if less than 95 percent", () => {
      const data = Object.assign({}, playResponse, {
        streamInfo: {
          event: false,
          live: false,
          static: true,
        },
        durationInMilliseconds: 1000,
        bookmarks: {
          lastViewedOffset: 500,
        },
      });
      const startTime = getStartTime(data as unknown as PlayResponse);
      expect(startTime).toBe(0.5);
    });
    it("Should respond with undefined if more than 95 percent have been consumed", () => {
      const data = Object.assign({}, playResponse, {
        streamInfo: {
          event: false,
          live: false,
          static: true,
        },
        durationInMilliseconds: 1000,
        bookmarks: {
          lastViewedOffset: 955,
        },
      });
      const startTime = getStartTime(data as unknown as PlayResponse);
      expect(startTime).toBe(undefined);
    });
  });
});
