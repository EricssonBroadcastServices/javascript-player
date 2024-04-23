// SPDX-FileCopyrightText: 2024 Red Bee Media Ltd <https://www.redbeemedia.com/>
//
// SPDX-License-Identifier: MIT

import { getBrowser, getBrowserVersion } from "../../device/common";

/**
 * Patch MediaSource to allow setting the duration to something else than Infinity.
 * Setting duration to infintiy breaks live seeking on Chrome 53 ( WebOS 4.x )
 */
export function patchMediaSourceChrome53() {
  if (getBrowser() === "chrome" && getBrowserVersion() === 53) {
    let durationSet = false;
    // Override MediaSource to provide unsupported methods in Chrome 53, this will cause dash.js
    // to call `setLiveSeekableRange` when the stream starts.
    // This allows us to access the MediaSource instance used by dash.js and
    // set the duration to `Math.pow(2, 32)` ( copied from shaka ).
    MediaSource.prototype.clearLiveSeekableRange = function () {
      /* no-op */
    };
    MediaSource.prototype.setLiveSeekableRange = function () {
      if (durationSet) {
        return;
      }
      try {
        this.duration = Math.pow(2, 32);
        durationSet = true;
      } catch (e) {}
    };
  }
}
