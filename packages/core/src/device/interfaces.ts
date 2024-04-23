// SPDX-FileCopyrightText: 2024 Red Bee Media Ltd <https://www.redbeemedia.com/>
//
// SPDX-License-Identifier: MIT

import {
  TDeviceModel,
  TDeviceType,
} from "@ericssonbroadcastservices/js-player-shared";

export interface IDevice {
  /**
   * UUID of the device, does not have to be a DUID can be generated but should be persistent between sessions.
   */
  id: string;
  type: TDeviceType;
  /**
   * Human-readble name of the device, used for device management.
   * @type {string}
   */
  name: string;
  /**
   * Model descriptor, used for filtering & analytics - eg. browser-chrome-111 OR samsung-tv-5.0 etc.
   */
  model: TDeviceModel;
  /**
   * Device specific Model number eg. SM-G950F, A2651
   */
  modelNumber?: string;
  /**
   * Device manufacturer eg. Apple, Samsung, Microsoft, Google
   */
  manufacturer: string;
  /**
   * Device OS, eg. OS X, Windows, Linux, WebOS, Tizen
   */
  os: string;
  /**
   * Version of the OS
   */
  osVersion: string;
}

export type TDeviceAdapter = (() => Promise<IDevice>) | undefined;
