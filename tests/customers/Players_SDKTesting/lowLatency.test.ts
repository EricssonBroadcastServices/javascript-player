// SPDX-FileCopyrightText: 2024 Red Bee Media Ltd <https://www.redbeemedia.com/>
//
// SPDX-License-Identifier: MIT

import test from "@playwright/test";

import { lowLatency } from "../../cases/lowLatency";
import config from "./config";

test.describe("methods", () => {
  const testable = config.testables.find(
    (testable) => testable.attributes?.lowLatency === true
  );

  lowLatency(testable, config);
});
