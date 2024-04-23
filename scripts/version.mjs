#!/usr/bin/env node

// SPDX-FileCopyrightText: 2024 Red Bee Media Ltd <https://www.redbeemedia.com/>
//
// SPDX-License-Identifier: MIT

import json from "../lerna.json"  assert { type: "json" };

console.log(json.version);