// SPDX-FileCopyrightText: 2024 Red Bee Media Ltd <https://www.redbeemedia.com/>
//
// SPDX-License-Identifier: MIT

/// <reference types="tizen-common-web" />
/// <reference types="tizen-tv-webapis" />

import {
  TTizenVersion,
  getDeviceId,
} from "@ericssonbroadcastservices/js-player-shared";

import { isSamsungTV } from "../common";
import { TDeviceAdapter } from "../interfaces";

function hasWebapis() {
  return !!document.querySelector('script[src="$WEBAPIS/webapis/webapis.js"]');
}

export function getSamsungAdapter(): TDeviceAdapter | undefined {
  if (!isSamsungTV()) {
    return;
  }
  if (!hasWebapis()) {
    console.warn(
      "[RedBeeMedia] You are using a Samsung TV, but the webapis script is not loaded. The player may not function properly."
    );
    return;
  }
  return async () => {
    const tizenVersion = tizen.systeminfo.getCapability(
      "http://tizen.org/feature/platform.version"
    );

    const modelNumber = webapis.productinfo.getRealModel();

    return {
      id: getDeviceId(),
      type: "ctv",
      name: `SamsungTV ${modelNumber}`,
      manufacturer: "samsung",
      model: `samsung-tv-${tizenVersion as TTizenVersion}`,
      modelNumber,
      os: "Tizen",
      osVersion: tizenVersion,
    };
  };
}
