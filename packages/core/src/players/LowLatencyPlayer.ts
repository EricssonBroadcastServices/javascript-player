// SPDX-FileCopyrightText: 2024 Red Bee Media Ltd <https://www.redbeemedia.com/>
//
// SPDX-License-Identifier: MIT

import {
  ErrorTypes,
  InitError,
} from "@ericssonbroadcastservices/js-player-shared";

import { DashJs } from "../engines/DashJs";
import { AssetPlayer } from "./AssetPlayer";

export class LowLatencyPlayer extends AssetPlayer {
  getPlayerEngine() {
    const preferredFormats = this.instanceSettings.initOptions.preferredFormats;
    const format = this.instanceSettings?.formats?.find(
      (f) => f.format === "DASH"
    );
    this.mediaLocator = format?.mediaLocator;
    this.playbackFormat = format?.format;
    if (
      preferredFormats?.includes("DASH") ||
      preferredFormats?.includes("dash")
    ) {
      return new DashJs(this.videoElement, this.instanceSettings);
    }
    const errMsg = `Low Latency Support for ${preferredFormats} not yet implemented`;
    throw new InitError(errMsg, {
      type: ErrorTypes.OPTIONS,
    });
  }
}
