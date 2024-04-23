// SPDX-FileCopyrightText: 2024 Red Bee Media Ltd <https://www.redbeemedia.com/>
//
// SPDX-License-Identifier: MIT

declare module "webvtt-parser" {
  export class WebVTTParser {
    public parse: (
      input: string,
      mode?: "metadata" | "chapters"
    ) => {
      cues: VTTCue[];
      styles: string[];
      errors: { message: string; line: number; col: number }[];
      time: number;
    };
  }
}
