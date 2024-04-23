// SPDX-FileCopyrightText: 2024 Red Bee Media Ltd <https://www.redbeemedia.com/>
//
// SPDX-License-Identifier: MIT

import { PlayResponse } from "@ericssonbroadcastservices/rbm-ott-sdk";

// Disregard last position if it was at the end credits (decimal number between 0-1)
const RESTART_THRESHOLD = 0.95;

export function getStartTime({
  streamInfo,
  bookmarks,
  durationInMilliseconds,
}: Partial<PlayResponse> = {}): number | undefined {
  const lastViewedOffset = bookmarks?.lastViewedOffset;
  if (
    streamInfo &&
    !streamInfo.live &&
    lastViewedOffset &&
    durationInMilliseconds
  ) {
    if (lastViewedOffset / durationInMilliseconds < RESTART_THRESHOLD) {
      return lastViewedOffset / 1000;
    }
  }
  return;
}
