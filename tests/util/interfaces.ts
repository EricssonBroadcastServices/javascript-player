// SPDX-FileCopyrightText: 2024 Red Bee Media Ltd <https://www.redbeemedia.com/>
//
// SPDX-License-Identifier: MIT

export type Testable = {
  disabled?: boolean;
  assetId: string;
  attributes?: {
    ssai?: boolean;
    drm?: boolean;
    live?: boolean;
    seekable?: boolean;
    lowLatency?: boolean;
  };
};

export type TestUser = {
  username: string;
  password: string;
};

export type Config = {
  customer: string;
  businessUnit: string;
  exposureBaseUrl:
    | "https://exposure.api.redbee.dev"
    | "https://exposure.api.redbee.live";
  testables: Testable[];
  user: TestUser;
};
