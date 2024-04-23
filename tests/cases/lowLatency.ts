// SPDX-FileCopyrightText: 2024 Red Bee Media Ltd <https://www.redbeemedia.com/>
//
// SPDX-License-Identifier: MIT

import { expect, test } from "@playwright/test";

import { tag } from "../util/helpers";
import { Config, Testable } from "../util/interfaces";
import { loadPlayer } from "../util/player";
import { generatePlayerUrl } from "../util/server";

export function lowLatency(testable: Testable, config: Config) {
  if (!testable.attributes.lowLatency) {
    return;
  }

  test(`${tag(
    testable,
    config
  )} the player latency is < 10s and the target delay is less or equal to 5s`, async ({
    page,
  }) => {
    await loadPlayer(page, await generatePlayerUrl(testable, config));
    // play for 5 sec to let it cathcup if needed
    await page.waitForTimeout(5000);

    const targetDelay = await page.evaluate(() => {
      // @ts-ignore, core is private but we ignore that because we need it
      return window.player.core.player.playerEngine.mediaPlayer.getTargetLiveDelay();
    });

    expect(targetDelay).toBeLessThanOrEqual(5);

    const latency = await page.evaluate(() => {
      // @ts-ignore, core is private but we ignore that because we need it
      return window.player.core.player.playerEngine.mediaPlayer.getCurrentLiveLatency();
    });

    expect(latency).toBeLessThan(10);
  });
}
