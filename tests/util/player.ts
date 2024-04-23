// SPDX-FileCopyrightText: 2024 Red Bee Media Ltd <https://www.redbeemedia.com/>
//
// SPDX-License-Identifier: MIT

import { Page } from "@playwright/test";

import type { RedBeePlayer } from "../../packages/player";
import { PlayerEvents, PlayerState } from "../../packages/shared";

type EventStorageEvent = { event: PlayerEvents; data: any };

declare global {
  interface Window {
    player: RedBeePlayer;
    eventStorage: EventStorageEvent[];
  }
}

export async function loadPlayer(page: Page, url: string) {
  await page.goto(url);
  const play = page.locator("#load-button");
  await play.click();
  await waitForPlayerCreated({ page });
}

export function eventCount(events: EventStorageEvent[], event: PlayerEvents) {
  return events.filter((e) => e.event === event).length;
}

export async function waitForPlayerEvent({
  page,
  event,
  checkStorage = false,
}: {
  page: Page;
  event: PlayerEvents;
  checkStorage?: boolean;
}): Promise<PlayerEvents> {
  return page.evaluate(
    async ({
      event,
      checkStorage,
    }: {
      event: PlayerEvents;
      checkStorage: boolean;
    }) => {
      return new Promise((resolve) => {
        if (
          checkStorage &&
          window.eventStorage.some((e) => e.event === event)
        ) {
          return resolve(event);
        }
        window.player.once(event, () => {
          void resolve(event);
        });
      });
    },
    { event, checkStorage }
  );
}

export async function waitForPlayerCreated({
  page,
}: {
  page: Page;
}): Promise<void> {
  return page.evaluate(() => {
    if (window.player) return Promise.resolve();
    return new Promise((resolve, reject) => {
      let index = 0;
      const interval = setInterval(() => {
        if (window.player) {
          clearInterval(interval);
          resolve();
        } else {
          if (index > 20) reject("Failed to find a player");
          index++;
        }
      }, 100);
    });
  });
}

export async function getPlayerState({
  page,
}: {
  page: Page;
}): Promise<PlayerState | undefined> {
  return page.evaluate(async () => window.player.getState());
}

export function getEventStorage({ page }: { page: Page }) {
  return page.evaluate(() => window.eventStorage ?? []);
}

export function playerSeekToTime(page: Page, time: number) {
  return page.evaluate((time) => {
    window.player.seekTo({ time });
  }, time);
}

export function playerSeekToOffset(page: Page, offset: number) {
  return page.evaluate((offset) => {
    window.player.seekToOffset(offset);
  }, offset);
}
