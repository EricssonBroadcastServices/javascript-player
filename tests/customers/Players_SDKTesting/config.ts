// SPDX-FileCopyrightText: 2024 Red Bee Media Ltd <https://www.redbeemedia.com/>
//
// SPDX-License-Identifier: MIT

import { Config } from "../../util/interfaces";

const config: Config = {
  customer: "Players",
  businessUnit: "SDKTesting",
  exposureBaseUrl: "https://exposure.api.redbee.dev",
  user: {
    username: "simon.wallin@mailinator.com",
    password: "SimonTest",
  },
  testables: [
    {
      assetId: "portrait_video_candles_E5D874b",
      attributes: {
        drm: false,
      },
    },
    {
      assetId: "0aa559eb-bdcd-4c0b-b138-48b813c06867_35FC49",
    },
    {
      assetId: "TearsOfSteel_UHD_35FC49",
      attributes: {
        drm: true,
      },
    },
    {
      assetId: "38a3422f-f778-4b4e-a64e-53987b344baa_E5D874b",
    },
    {
      assetId: "f7b38230_E5D874b",
      attributes: {
        live: true,
      },
    },
    {
      disabled: true, // Something is wrong with the virtual channel, backend - issue
      assetId: "932b4724-bb66-40bc-a346-ba14f046c3b5_E5D874b",
      attributes: {
        live: true,
        seekable: false,
      },
    },
    {
      assetId: "6eb14df0_E5D874b",
      attributes: {
        live: true,
        lowLatency: true,
      },
    },
  ],
};

export default config;
