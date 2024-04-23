// SPDX-FileCopyrightText: 2024 Red Bee Media Ltd <https://www.redbeemedia.com/>
//
// SPDX-License-Identifier: MIT

import test from "@playwright/test";

import { eventOrder } from "../../cases/eventOrder";
import { playing } from "../../cases/playing";
import { seek } from "../../cases/seek";
import config from "./config";

// This is the test suite for the Players/SDKTesting customer that contains tests for
// every single type of assets that Redbee has.
// The tests are generic in nature and just validates that basic functionality works for every
// single asset type.

test.describe("Players/SDKTesting", () => {
  config.testables.forEach((testable) => {
    if (testable.disabled) {
      console.warn(`Skipping disabled testable ${testable.assetId}`);
      return;
    }
    playing(testable, config);
    eventOrder(testable, config);
    seek(testable, config);
  });
});
