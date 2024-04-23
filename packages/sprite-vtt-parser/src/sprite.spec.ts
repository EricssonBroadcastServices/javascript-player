// SPDX-FileCopyrightText: 2024 Red Bee Media Ltd <https://www.redbeemedia.com/>
//
// SPDX-License-Identifier: MIT

import { vtt } from "./__fixtures__/sprites";
import * as sprite from "./index";

const BASE_URL =
  "https://ps.vemup.ctl.cdn.ebsd.ericsson.net/bscu/bsbu/assets/8fd8a01c-55bc-4f27-bc6f-7e185c44662c_82162E/materials/fVVjFwQjvA_82162E/sprites/sprites.vtt";

describe("sprite", () => {
  describe("parseImage", () => {
    it("creates an absolute URL from a relative image path", () => {
      const url = sprite.parseImage("image.jpg#xywh=0,0,160,90", BASE_URL);
      expect(url).toEqual(
        "https://ps.vemup.ctl.cdn.ebsd.ericsson.net/bscu/bsbu/assets/8fd8a01c-55bc-4f27-bc6f-7e185c44662c_82162E/materials/fVVjFwQjvA_82162E/sprites/image.jpg"
      );
    });
    it("uses the image path if it's absolute", () => {
      const absoluteImage = "http://www.redbee.com/image.jpg#xywh=0,0,160,90";
      const url = sprite.parseImage(absoluteImage, BASE_URL);
      expect(url).toBe("http://www.redbee.com/image.jpg");
    });
  });

  describe("parseDimensions", () => {
    it("parses a valid text to dimensions", () => {
      const dimensions = sprite.parseDimensions("image.jpg#xywh=30,40,160,90");
      expect(dimensions).toEqual({
        x: 30,
        y: 40,
        width: 160,
        height: 90,
      });
    });

    it("parses a valid text with whitespace between numbers to dimensions", () => {
      const dimensions = sprite.parseDimensions(
        "image.jpg#xywh=30 , 40 , 160    , 90"
      );
      expect(dimensions).toEqual({
        x: 30,
        y: 40,
        width: 160,
        height: 90,
      });
    });
  });

  describe("parseSpriteVTT", () => {
    it("parses vtt into cues", () => {
      const cues = sprite.parseSpriteVTT(vtt, BASE_URL, 0);
      expect(cues.length).toBe(24);
      expect(cues[6]).toEqual({
        start: 60,
        end: 70,
        image:
          "https://ps.vemup.ctl.cdn.ebsd.ericsson.net/bscu/bsbu/assets/8fd8a01c-55bc-4f27-bc6f-7e185c44662c_82162E/materials/fVVjFwQjvA_82162E/sprites/sprites.jpg",
        dimensions: {
          x: 160,
          y: 90,
          width: 160,
          height: 90,
        },
      });
    });
    it("parses vtt into cues with offset", () => {
      const cues = sprite.parseSpriteVTT(vtt, BASE_URL, 10);
      expect(cues.length).toBe(24);
      expect(cues[6]).toEqual({
        start: 50,
        end: 60,
        image:
          "https://ps.vemup.ctl.cdn.ebsd.ericsson.net/bscu/bsbu/assets/8fd8a01c-55bc-4f27-bc6f-7e185c44662c_82162E/materials/fVVjFwQjvA_82162E/sprites/sprites.jpg",
        dimensions: {
          x: 160,
          y: 90,
          width: 160,
          height: 90,
        },
      });
    });
  });
});
