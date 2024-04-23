// SPDX-FileCopyrightText: 2024 Red Bee Media Ltd <https://www.redbeemedia.com/>
//
// SPDX-License-Identifier: MIT

import { expect, test } from "@playwright/test";

import {
  PlaybackState,
  PlayerEvents,
} from "@ericssonbroadcastservices/js-player-shared";

import { tag } from "../util/helpers";
import { Config, Testable } from "../util/interfaces";
import {
  eventCount,
  getEventStorage,
  getPlayerState,
  loadPlayer,
} from "../util/player";
import { generatePlayerUrl } from "../util/server";

export function autoplay(testable: Testable, config: Config) {
  test(`${tag(
    testable,
    config
  )} autoplay = true playback starts after load()`, async ({ page }) => {
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

export function notAutoplay(testable: Testable, config: Config) {
  test(`${tag(
    testable,
    config
  )} autoplay = false playback is paused after load()`, async ({ page }) => {
    await loadPlayer(
      page,
      await generatePlayerUrl(testable, config, { autoplay: false })
    );

    const initialState = await getPlayerState({ page });

    // play for 5 sec
    await page.waitForTimeout(5000);

    const playerState = await getPlayerState({ page });
    const events = await getEventStorage({ page });

    expect(eventCount(events, PlayerEvents.LOADED)).toBe(1);
    expect(eventCount(events, PlayerEvents.START)).toBe(0);
    expect(eventCount(events, PlayerEvents.TIME_UPDATE)).toBe(0);

    // even though the playbackState should be paused the event shouldn't be emitted
    expect(eventCount(events, PlayerEvents.PAUSE)).toBe(0);

    expect(playerState.currentTime > initialState.currentTime).toBe(false);
    expect(playerState.playbackState).toBe(PlaybackState.PAUSED);
  });
}
