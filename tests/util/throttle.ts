// SPDX-FileCopyrightText: 2024 Red Bee Media Ltd <https://www.redbeemedia.com/>
//
// SPDX-License-Identifier: MIT

import { Page } from "@playwright/test";

export const SpeedPresets = {
  offline: {
    offline: true,
    downloadThroughput: -1,
    uploadThroughput: -1,
    latency: -1,
  },
  slow3G: {
    offline: false,
    downloadThroughput: (376 * 1024) / 8,
    uploadThroughput: (100 * 1024) / 8,
    latency: 2500,
  },
  regular3G: {
    offline: false,
    downloadThroughput: (750 * 1024) / 8,
    uploadThroughput: (250 * 1024) / 8,
    latency: 100,
  },
  good3G: {
    offline: false,
    downloadThroughput: (1000 * 1024) / 8,
    uploadThroughput: (750 * 1024) / 8,
    latency: 40,
  },
  regular4G: {
    offline: false,
    downloadThroughput: (4000 * 1024) / 8,
    uploadThroughput: (3000 * 1024) / 8,
    latency: 20,
  },
  DSL: {
    offline: false,
    downloadThroughput: (2000 * 1024) / 8,
    uploadThroughput: (1000 * 1024) / 8,
    latency: 5,
  },
  WiFi: {
    offline: false,
    downloadThroughput: (30000 * 1024) / 8,
    uploadThroughput: (15000 * 1024) / 8,
    latency: 2,
  },
};

export async function throttle(page: Page, speed: any) {
  const client = await page.context().newCDPSession(page);
  await client.send("Network.enable");
  await client.send("Network.emulateNetworkConditions", { ...speed });
}
