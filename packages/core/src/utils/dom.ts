// SPDX-FileCopyrightText: 2024 Red Bee Media Ltd <https://www.redbeemedia.com/>
//
// SPDX-License-Identifier: MIT

import { getBrowser } from "../device/common";

export function setupVideoElement(): HTMLVideoElement {
  const videoElement = document.createElement("video");
  videoElement.setAttribute("playsinline", "");
  if (getBrowser() === "firefox") {
    videoElement.setAttribute("preload", "auto");
  }
  return videoElement;
}
