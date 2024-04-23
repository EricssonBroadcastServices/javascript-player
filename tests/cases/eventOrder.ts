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

export function eventOrder(testable: Testable, config: Config) {
  test(`${tag(
    testable,
    config
  )} events should be emitted in the correct order`, async ({ page }) => {
    await loadPlayer(page, await generatePlayerUrl(testable, config));
    await page.waitForTimeout(5000);

    const playerState = await getPlayerState({ page });
    const events = await getEventStorage({ page });

    let lastEventIndex = -1;
    [
      PlayerEvents.PLAYER_SETUP_COMPLETED,
      PlayerEvents.ENTITLEMENT_GRANTED,
      PlayerEvents.LOADING,
      PlayerEvents.LOADED,
      PlayerEvents.START,
    ].forEach((playerEvent) => {
      expect(eventCount(events, playerEvent)).toBe(1);

      const eventIndex = events.findIndex(({ event }) => event === playerEvent);
      expect(eventIndex, playerEvent).toBeGreaterThan(lastEventIndex);
      lastEventIndex = eventIndex;
    });

    expect(eventCount(events, PlayerEvents.TIME_UPDATE) > 0).toBe(true);
    expect(eventCount(events, PlayerEvents.STATE_CHANGED) > 0).toBe(true);
    expect(eventCount(events, PlayerEvents.BITRATE_CHANGED) > 0).toBe(true);

    expect(eventCount(events, PlayerEvents.PAUSE)).toBe(0);

    expect(playerState.playbackState).toBe(PlaybackState.PLAYING);
  });
}
