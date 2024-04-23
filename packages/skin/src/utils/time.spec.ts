// SPDX-FileCopyrightText: 2024 Red Bee Media Ltd <https://www.redbeemedia.com/>
//
// SPDX-License-Identifier: MIT

import {
  formatPlayerWallClockTime as formatPWCT,
  formatPlayerTime,
  getTimeSpanString,
} from "./time";

describe("time", () => {
  describe("getTimeSpanString", () => {
    // test description is vague/generic because this one test tests everything
    it("should be correctly formatted", () => {
      const timespan = getTimeSpanString(
        // For testability, times are intentionally created in the current locale
        // and using today's date to get the right DST time zone
        new Date(new Date().setHours(14, 45, 0)),
        new Date(new Date().setHours(17, 12, 0))
      );
      expect(timespan).toEqual("14:45 - 17:12");
    });
  });
  describe("formatPlayerTime", () => {
    it("should reply with hours, minutes and seconds if over 3600 seconds", () => {
      expect(formatPlayerTime(3601)).toEqual("01:00:01");
    });
    it("should reply with minutes and seconds if under 3600 seconds", () => {
      expect(formatPlayerTime(120)).toEqual("02:00");
    });
    it("should reply with zero minutes + defined seconds if under 60 seconds", () => {
      expect(formatPlayerTime(23)).toEqual("00:23");
    });
  });

  describe("formatPlayerWallClockTime", () => {
    const timestamp1 = 1112202000000; // 2005-03-30 17:00:00 UTC
    const timestamp2 = 909090900000; // 1998-10-22 21:15:00 UTC
    it("should zero pad all numbers", () => {
      expect(formatPWCT(timestamp1, "Indian/Christmas")).toEqual("00:00:00");
    });
    it("should respond different to differnt input timestamps", () => {
      expect(formatPWCT(timestamp1, "Etc/UTC")).toEqual("17:00:00");
      expect(formatPWCT(timestamp2, "Etc/UTC")).toEqual("21:15:00");
    });
    it("should default to the users timezone", () => {
      const userTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
      expect(formatPWCT(timestamp1)).toEqual(
        formatPWCT(timestamp1, userTimezone)
      );
      expect(formatPWCT(timestamp1, "InvalidTZ")).toEqual(
        formatPWCT(timestamp1, userTimezone)
      );
    });
    it("should adjust correctly to the given time zone", () => {
      expect(formatPWCT(timestamp1, "Europe/Rome")).toEqual("19:00:00");
      expect(formatPWCT(timestamp1, "Indian/Cocos")).toEqual("23:30:00");
      expect(formatPWCT(timestamp1, "Pacific/Fiji")).toEqual("05:00:00");
    });
  });
});
