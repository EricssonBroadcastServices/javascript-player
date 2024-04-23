// SPDX-FileCopyrightText: 2024 Red Bee Media Ltd <https://www.redbeemedia.com/>
//
// SPDX-License-Identifier: MIT

interface Window {
  __RED_BEE_MEDIA__?: {
    supportedFormats?: ("DASH" | "HLS")[];
    preferredFormats?: ("dash" | "hls")[];
    engine?: "dashjs" | "shaka" | "hlsjs" | "native";
  };
}
