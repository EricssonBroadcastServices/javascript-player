// SPDX-FileCopyrightText: 2024 Red Bee Media Ltd <https://www.redbeemedia.com/>
//
// SPDX-License-Identifier: MIT

import { Config, Testable } from "./interfaces";

const PLAYER_URL = process.env.CI
  ? "https://ericssonbroadcastservices.github.io/javascript-player/"
  : "http://localhost:1234";

const sessionTokenCache: Map<Config, string> = new Map();

async function getSessionToken(config: Config) {
  if (sessionTokenCache.has(config)) {
    return sessionTokenCache.get(config);
  }
  const {
    customer,
    businessUnit,
    exposureBaseUrl,
    user: { username, password },
  } = config;
  const response = await fetch(
    new URL(
      `/v3/customer/${customer}/businessunit/${businessUnit}/auth/login`,
      exposureBaseUrl
    ),
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username,
        password,
        device: {
          deviceId: "ThisIsATestDeviceForTeamPlayers",
          type: "WEB",
          name: "ThisIsATestDoneByTeamPlayers",
        },
        informationCollectionConsentGivenNow: false,
      }),
    }
  );
  const json = await response.json();
  sessionTokenCache.set(config, json.sessionToken);
  return json.sessionToken;
}

type GeneratePlayerUrlOptions = {
  autoplay?: boolean;
};

export async function generatePlayerUrl(
  testable: Testable,
  config: Config,
  options: GeneratePlayerUrlOptions = {
    autoplay: true,
  }
) {
  const sessionToken = await getSessionToken(config);
  return `${PLAYER_URL}/?cu=${config.customer}&bu=${
    config.businessUnit
  }&source=${testable.assetId}&sessionToken=${encodeURIComponent(
    sessionToken
  )}&env=${config.exposureBaseUrl}&debug=true&autoplay=${options?.autoplay}`;
}
