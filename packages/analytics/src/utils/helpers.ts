// SPDX-FileCopyrightText: 2024 Red Bee Media Ltd <https://www.redbeemedia.com/>
//
// SPDX-License-Identifier: MIT

export interface IDeviceStats {
  deviceMemory?: number | undefined;
  heapSizeLimit?: number | undefined;
  totalHeapSize?: number | undefined;
  usedHeapSize?: number | undefined;
  cpuCores?: number | undefined;
  networkDownlink?: number | undefined;
  networkType?: string | undefined;
  visibility?: DocumentVisibilityState | undefined;
}

export function getDeviceStats(): IDeviceStats {
  const memoryUsage = (window.performance as any)?.memory;
  const nav = window.navigator as any;
  const network = nav?.connection;

  return {
    cpuCores: nav?.hardwareConcurrency,
    deviceMemory: nav?.deviceMemory,
    heapSizeLimit: memoryUsage?.jsHeapSizeLimit,
    totalHeapSize: memoryUsage?.totalJSHeapSize,
    usedHeapSize: memoryUsage?.usedJSHeapSize,
    networkDownlink: network?.downlink,
    networkType: network?.effectiveType,
    visibility: document.visibilityState,
  };
}
