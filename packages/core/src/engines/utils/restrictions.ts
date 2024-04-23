// SPDX-FileCopyrightText: 2024 Red Bee Media Ltd <https://www.redbeemedia.com/>
//
// SPDX-License-Identifier: MIT

import { ContractRestrictions } from "@ericssonbroadcastservices/rbm-ott-sdk";

import { isLGTV } from "../../device/common";

export type TRestrictions = {
  minBitrate?: number;
  maxBitrate?: number;
  maxResHeight?: number;
};

type TDeviceRestrictions = {
  maxResHeight?: number;
};

// exported for unit-tests
export function getDeviceRestrictions(): Promise<Partial<TDeviceRestrictions>> {
  // LG SmartTV
  if (isLGTV()) {
    return new Promise((resolve) => {
      // this timeout _should_ never happen as the callback is seemingly called instantly
      const timeout = setTimeout(() => resolve({}), 1000);

      (window as any).webOS.deviceInfo(({ uhd }: any) => {
        clearTimeout(timeout);
        if (uhd) {
          resolve({});
        } else {
          resolve({
            maxResHeight: 1080,
          });
        }
      });
    });
  }
  return Promise.resolve({});
}

export async function getResolutionAndBitrateRestrictions(
  contractRestrictions: ContractRestrictions = {}
): Promise<TRestrictions> {
  const restrictions: TRestrictions = {
    minBitrate: contractRestrictions.minBitrate,
    maxBitrate: contractRestrictions.maxBitrate,
    maxResHeight: contractRestrictions.maxResHeight,
  };

  const deviceRestrictions = await getDeviceRestrictions();

  if (
    deviceRestrictions.maxResHeight &&
    (!restrictions.maxResHeight ||
      restrictions.maxResHeight > deviceRestrictions.maxResHeight)
  ) {
    restrictions.maxResHeight = deviceRestrictions.maxResHeight;
  }

  return Promise.resolve(restrictions);
}
