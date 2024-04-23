// SPDX-FileCopyrightText: 2024 Red Bee Media Ltd <https://www.redbeemedia.com/>
//
// SPDX-License-Identifier: MIT

import { getBrowserDevice } from "./adapters/browser";
import { getLGTVAdapter } from "./adapters/lg";
import { getSamsungAdapter } from "./adapters/samsung";
import { IDevice, TDeviceAdapter } from "./interfaces";

let _device: IDevice | undefined;
export async function getDevice(adapter?: TDeviceAdapter): Promise<IDevice> {
  if (_device) {
    return Promise.resolve(_device);
  }

  const _adapter =
    adapter ||
    [getLGTVAdapter(), getSamsungAdapter()].find((adapter) => !!adapter);

  const device = await (_adapter ? _adapter() : getBrowserDevice());
  _device = device;
  return device;
}
