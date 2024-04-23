// SPDX-FileCopyrightText: 2024 Red Bee Media Ltd <https://www.redbeemedia.com/>
//
// SPDX-License-Identifier: MIT

import { AudioIdentifier, TextIdentifier } from "./interfaces";

interface IPreferences {
  audio?: AudioIdentifier;
  subtitle?: TextIdentifier;
}

const STORAGE_KEY = "@redbeemedia/javascript-player:preferences";

export function getPreferences(): IPreferences {
  try {
    const item = localStorage.getItem(STORAGE_KEY);
    if (item) {
      return (JSON.parse(item) ?? {}) as IPreferences;
    }
  } catch (e) {}
  return {};
}

export function setPreferences(preferences: Partial<IPreferences>): void {
  try {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        ...getPreferences(),
        ...preferences,
      })
    );
  } catch (e) {
    /* no-op */
  }
}
