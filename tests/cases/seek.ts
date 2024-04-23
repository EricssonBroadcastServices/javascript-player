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
  playerSeekToOffset,
  playerSeekToTime,
  waitForPlayerEvent,
} from "../util/player";
import { generatePlayerUrl } from "../util/server";

export function seek(testable: Testable, config: Config) {
  if (testable.attributes?.seekable === false) {
    return;
  }
  test(`${tag(
    testable,
    config
  )} should seek and emit the seeked event`, async ({ page }) => {
    await loadPlayer(
      page,
      await generatePlayerUrl(testable, config, { autoplay: false })
    );
    await waitForPlayerEvent({
      event: PlayerEvents.LOADED,
      page,
      checkStorage: true,
    });

    const { isSeekable } = await getPlayerState({ page });

    test.skip(
      !isSeekable,
      "The testable is currently not seekable, try again later."
    );

    let seeks = 0;

    if (!testable.attributes?.live) {
      playerSeekToTime(page, 5);
      seeks++;
      await waitForPlayerEvent({ event: PlayerEvents.SEEKED, page });
    }

    const playerState_ahead = await getPlayerState({ page });

    playerSeekToOffset(page, -5);
    seeks++;
    await waitForPlayerEvent({ event: PlayerEvents.SEEKED, page });

    const playerState_behind = await getPlayerState({ page });

    const events = await getEventStorage({ page });

    expect(eventCount(events, PlayerEvents.SEEKING)).toBe(seeks);
    expect(eventCount(events, PlayerEvents.SEEKED)).toBe(seeks);
    expect(
      events.findIndex((e) => e.event === PlayerEvents.SEEKED) >
        events.findIndex((e) => e.event === PlayerEvents.SEEKING)
    ).toBe(true);

    expect(
      playerState_ahead.currentTime - playerState_behind.currentTime
    ).toBeCloseTo(5, 1);
  });
}
