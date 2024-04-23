// SPDX-FileCopyrightText: 2024 Red Bee Media Ltd <https://www.redbeemedia.com/>
//
// SPDX-License-Identifier: MIT

import test from "@playwright/test";

import { methods } from "../../cases/methods";
import config from "./config";

test.describe("methods", () => {
  const drm = config.testables.find(
    (testable) => testable.attributes?.drm === false
  );
  const noDrm = config.testables.find(
    (testable) => testable.attributes?.drm === true
  );
  const lowLatency = config.testables.find(
    (testable) => testable.attributes?.lowLatency === true
  );

  methods(drm, config);
  methods(noDrm, config);
  methods(lowLatency, config);
});
