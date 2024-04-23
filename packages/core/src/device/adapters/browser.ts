// SPDX-FileCopyrightText: 2024 Red Bee Media Ltd <https://www.redbeemedia.com/>
//
// SPDX-License-Identifier: MIT

import platform from "platform";

import {
  TBrowser,
  TDeviceType,
  getDeviceId,
} from "@ericssonbroadcastservices/js-player-shared";

import { getBrowser, getBrowserVersion, getOS } from "../common";
import { IDevice } from "../interfaces";

const ManufacturerMap: { [key in TBrowser]: string } = {
  firefox: "mozilla",
  edge: "microsoft",
  chrome: "google",
  safari: "apple",
  unknown: "unknown",
};

export function getDeviceType(): TDeviceType {
  const userAgent = window.navigator.userAgent.toLowerCase();
  if (
    /iphone|ipod|android|blackberry|windows phone|iemobile|wpdesktop/.test(
      userAgent
    ) &&
    !/crkey/.test(userAgent)
  ) {
    return "mobile";
  }
  if (/ipad/.test(userAgent) || "ontouchstart" in document.documentElement) {
    return "tablet";
  }
  return "desktop";
}

export async function getBrowserDevice(): Promise<IDevice> {
  const browser = getBrowser();
  const browserVersion = getBrowserVersion();
  const type = getDeviceType();
  return {
    id: getDeviceId(),
    type,
    name: `${getOS()} ${browser} ${browserVersion}`,
    manufacturer: ManufacturerMap[browser],
    model: `${type}-browser-${browser}-${browserVersion}`,
    os: platform.os?.family ?? "unknown",
    osVersion: platform.os?.version ?? "unknown",
  };
}
