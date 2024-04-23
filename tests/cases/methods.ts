// SPDX-FileCopyrightText: 2024 Red Bee Media Ltd <https://www.redbeemedia.com/>
//
// SPDX-License-Identifier: MIT

import { expect, test } from "@playwright/test";

import { PlayerEvents } from "@ericssonbroadcastservices/js-player-shared";

import { tag } from "../util/helpers";
import { Config, Testable } from "../util/interfaces";
import { loadPlayer, waitForPlayerEvent } from "../util/player";
import { generatePlayerUrl } from "../util/server";

export function methods(testable: Testable, config: Config) {
  test(`${tag(
    testable,
    config
  )} getPlayerInfo() should provide the correct player info`, async ({
    page,
  }) => {
    await loadPlayer(page, await generatePlayerUrl(testable, config));
    await waitForPlayerEvent({
      event: PlayerEvents.LOADED,
      page,
      checkStorage: true,
    });

    const playerInfo = await page.evaluate(() => window.player.getPlayerInfo());

    if (testable.attributes.lowLatency) {
      expect(playerInfo.playerEngine.name).toBe("Dashjs");
    } else {
      expect(playerInfo.playerEngine.name).toBe("Shaka Player");
    }
  });

  test(`${tag(
    testable,
    config
  )} getStreamInfo() should provide the correct stream info`, async ({
    page,
  }) => {
    await loadPlayer(page, await generatePlayerUrl(testable, config));
    await waitForPlayerEvent({
      event: PlayerEvents.LOADED,
      page,
      checkStorage: true,
    });

    const streamInfo = await page.evaluate(() => window.player.getStreamInfo());

    expect(streamInfo.format).toBe("DASH");
    expect(streamInfo.hasDrm).toBe(!!testable.attributes.drm);
  });
}
