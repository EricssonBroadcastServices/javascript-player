// SPDX-FileCopyrightText: 2024 Red Bee Media Ltd <https://www.redbeemedia.com/>
//
// SPDX-License-Identifier: MIT

import { IPlayerCoreOptions } from "./interfaces";

export const PLAYER_OPTIONS: Partial<IPlayerCoreOptions> = {
  autoplay: true,
  muted: false,
  preferredFormats: ["dash", "hls", "mp4", "mp3"],
  keysystem: undefined,
};

if (process.env.NODE_ENV === "development") {
  if ((window as any).__RED_BEE_MEDIA__) {
    PLAYER_OPTIONS.preferredFormats = (
      window as any
    ).__RED_BEE_MEDIA__.preferredFormats;
  }
}

export const MIN_DVR_WINDOW = 90; // min seconds for a live asset to be considered seekable.
