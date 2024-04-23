// SPDX-FileCopyrightText: 2024 Red Bee Media Ltd <https://www.redbeemedia.com/>
//
// SPDX-License-Identifier: MIT

import {
  IAdsOptions,
  getSessionIFA,
} from "@ericssonbroadcastservices/js-player-shared";

import { IDevice } from "../device/interfaces";
import { getIframeURL } from "./helpers";

export async function enrichAdsOptions(
  adsOptions: IAdsOptions,
  videoElement: HTMLVideoElement,
  device: IDevice,
  autoplay?: boolean
): Promise<IAdsOptions> {
  const { ifa, ifaType } = getSessionIFA();

  return {
    deviceType: device.type,
    deviceModel: device.model,
    deviceModelNumber: device.modelNumber,
    deviceMake: device.manufacturer,
    width: videoElement.offsetWidth,
    height: videoElement.offsetHeight,
    pageUrl: window.location.href,
    domain: getIframeURL()?.hostname || window.location.hostname,
    mute: videoElement.muted,
    autoplay,
    ifa,
    ifaType,
    ...adsOptions,
  };
}
