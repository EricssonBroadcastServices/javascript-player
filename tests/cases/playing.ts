// SPDX-FileCopyrightText: 2024 Red Bee Media Ltd <https://www.redbeemedia.com/>
//
// SPDX-License-Identifier: MIT

import { expect, test } from "@playwright/test";

import { PlayerEvents } from "@ericssonbroadcastservices/js-player-shared";

import { tag } from "../util/helpers";
import { Config, Testable } from "../util/interfaces";
import {
  eventCount,
  getEventStorage,
  getPlayerState,
  loadPlayer,
} from "../util/player";
import { generatePlayerUrl } from "../util/server";

export function playing(testable: Testable, config: Config) {
  test(`${tag(
    testable,
    config
  )} playback starts and currentTime moves forward`, async ({ page }) => {
    await loadPlayer(page, await generatePlayerUrl(testable, config));

    const initialState = await getPlayerState({ page });

    // play for 5 sec
    await page.waitForTimeout(5000);

    const playerState = await getPlayerState({ page });
    const events = await getEventStorage({ page });

    expect(eventCount(events, PlayerEvents.LOADED)).toBe(1);
    expect(eventCount(events, PlayerEvents.START)).toBe(1);

    expect(eventCount(events, PlayerEvents.TIME_UPDATE) > 0).toBe(true);

    expect(playerState.currentTime > initialState.currentTime).toBe(true);
  });
}
