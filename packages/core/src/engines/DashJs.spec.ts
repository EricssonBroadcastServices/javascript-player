// SPDX-FileCopyrightText: 2024 Red Bee Media Ltd <https://www.redbeemedia.com/>
//
// SPDX-License-Identifier: MIT

import dashjs from "dashjs";

import { getBrowserVersion, isLGTV } from "../device/common";
import { getCapabilitiesFilter } from "./DashJs";

const capabilitiesFilter = getCapabilitiesFilter();
const capabilitiesFilterHEVCNoWidevine = getCapabilitiesFilter(false);

jest.mock("../device/common");

describe("DashJS", () => {
  describe("capabilitiesFilter", () => {
    const hevcBadRepresentation: Partial<dashjs.Representation> = {
      frameRate: 30,
      codecs: "hvc1.1.6.L90.B0",
    };
    const hevcGoodRepresentation: Partial<dashjs.Representation> = {
      frameRate: 30,
      codecs: "hvc1.1.6.L90.90",
    };
    const avcNormalFramerateRepresentation: Partial<dashjs.Representation> = {
      frameRate: 30,
      codecs: "avc1.4d401f",
    };
    const avcHighFramerateRepresentation: Partial<dashjs.Representation> = {
      frameRate: 31,
      codecs: "avc1.4d401f",
    };

    describe("LG & Chrome 38", () => {
      beforeAll(() => {
        (isLGTV as jest.Mock).mockReturnValue(true);
        (getBrowserVersion as jest.Mock).mockReturnValue(38);
      });

      it("filters out representations with codec hvc1.1.6.L90.B0", async () => {
        expect(capabilitiesFilter(hevcBadRepresentation)).toBe(false);
      });

      it("does not filter out representations with codec hvc1.1.6.L90.90", async () => {
        expect(capabilitiesFilter(hevcGoodRepresentation)).toBe(true);
      });

      it("filters out representations with frameRate over 30", async () => {
        expect(capabilitiesFilter(avcHighFramerateRepresentation)).toBe(false);
      });

      it("does not filter out representations with frameRate 30", async () => {
        expect(capabilitiesFilter(avcNormalFramerateRepresentation)).toBe(true);
      });
    });

    describe("Other devices", () => {
      beforeAll(() => {
        (isLGTV as jest.Mock).mockReturnValue(false);
        (getBrowserVersion as jest.Mock).mockReturnValue(99);
      });

      it("does not filter out representations with codec hvc1.1.6.L90.B0", async () => {
        expect(capabilitiesFilter(hevcBadRepresentation)).toBe(true);
      });

      it("does not filter out representations with codec hvc1.1.6.L90.90", async () => {
        expect(capabilitiesFilter(hevcGoodRepresentation)).toBe(true);
      });

      it("does not filters out representations with frameRate over 30", async () => {
        expect(capabilitiesFilter(avcHighFramerateRepresentation)).toBe(true);
      });

      it("does not filter out representations with frameRate 30", async () => {
        expect(capabilitiesFilter(avcNormalFramerateRepresentation)).toBe(true);
      });

      it("filters out hevc representation when HEVC DRM is not supported", () => {
        expect(capabilitiesFilterHEVCNoWidevine(hevcGoodRepresentation)).toBe(
          false
        );
        expect(capabilitiesFilterHEVCNoWidevine(hevcBadRepresentation)).toBe(
          false
        );
      });
    });
  });
});
