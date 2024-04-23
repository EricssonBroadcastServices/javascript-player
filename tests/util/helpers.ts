// SPDX-FileCopyrightText: 2024 Red Bee Media Ltd <https://www.redbeemedia.com/>
//
// SPDX-License-Identifier: MIT

import { Config, Testable } from "./interfaces";
export function tag(testable: Testable, config: Config) {
  const { assetId } = testable;
  return `[${assetId}]`;
}
