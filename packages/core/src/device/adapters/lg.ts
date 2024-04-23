// SPDX-FileCopyrightText: 2024 Red Bee Media Ltd <https://www.redbeemedia.com/>
//
// SPDX-License-Identifier: MIT

import {
  TWebOSVersion,
  getDeviceId,
} from "@ericssonbroadcastservices/js-player-shared";

import { isLGTV } from "../common";
import { TDeviceAdapter } from "../interfaces";

interface LGWindow extends Window {
  webOS?: {
    platform: {
      tv?: boolean;
    };
    deviceInfo: (
      fn: (deviceInfo: { modelName: string; sdkVersion: string }) => void
    ) => void;
  };
  webOSDev: any;
  webOSSystem: any;
  PalmSystem: any;
}

declare const window: LGWindow;

function getDeviceInfo(): Promise<any> {
  return new Promise((resolve, reject) => {
    if (!window.webOS) {
      return reject("window.webOS does not exist");
    }
    window.webOS.deviceInfo((deviceInfo: any) => {
      resolve(deviceInfo);
    });
  });
}

export function getLGTVAdapter(): TDeviceAdapter | undefined {
  if (!isLGTV()) {
    if (window.navigator.userAgent.includes("Web0S")) {
      console.warn(
        "[RedBeeMedia] You are using an LG TV, but the webOS javascript libraries are not loaded. The player may not function properly."
      );
    }
    return;
  }
  return async () => {
    const deviceInfo = await getDeviceInfo();

    return {
      id: getDeviceId(),
      type: "ctv",
      name: `LGTV ${deviceInfo.modelName}`,
      manufacturer: "lg",
      model: `lg-tv-${deviceInfo.sdkVersion as TWebOSVersion}`,
      modelNumber: deviceInfo.modelName || "unknown",
      os: "WebOS",
      osVersion: deviceInfo.version,
    };
  };
}
