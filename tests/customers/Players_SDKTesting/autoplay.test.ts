// SPDX-FileCopyrightText: 2024 Red Bee Media Ltd <https://www.redbeemedia.com/>
//
// SPDX-License-Identifier: MIT

import test from "@playwright/test";

import { autoplay, notAutoplay } from "../../cases/autoplay";
import config from "./config";

test.describe("autoplay", () => {
  const testable = config.testables[0];
  autoplay(testable, config);
  notAutoplay(testable, config);
});
