// SPDX-FileCopyrightText: 2024 Red Bee Media Ltd <https://www.redbeemedia.com/>
//
// SPDX-License-Identifier: MIT

module.exports = {
  roots: ["<rootDir>/packages"],
  transform: {
    "^.+\\.[tj]sx?$": [
      "ts-jest",
      {
        isolatedModules: true,
      },
    ],
  },
  transformIgnorePatterns: [
    "./packages/core/node_modules/(?!(@eyevinn/media-event-filter))",
  ],
  testRegex: "(/__tests__/.*|(\\.|/)(test|spec))\\.ts?$",
  moduleFileExtensions: ["ts", "js"],
  testPathIgnorePatterns: [
    "/node_modules/",
    "/dist/",
    "dist",
    "/.cache/",
    "/.parcel-cache/",
  ],
  testEnvironment: "jsdom",
  collectCoverage: false,
};
