// SPDX-FileCopyrightText: 2024 Red Bee Media Ltd <https://www.redbeemedia.com/>
//
// SPDX-License-Identifier: MIT

import type {
  IRedBeePlayerAnalyticsOptions,
  IRedBeePlayerOptions,
  IRedBeePlayerSkinOptions,
} from "@ericssonbroadcastservices/javascript-player";

const defaultBaseURL = "https://exposure.api.redbee.live";

// prettier-ignore
const playerOptionsAttributes = [
  ["player",    "customer",         "string"                ],
  ["player",    "businessUnit",     "string"                ],
  ["player",    "exposureBaseUrl",  "string"                ],
  ["player",    "sessionToken",     "string"                ],
  ["player",    "autoplay",         "boolean"               ],
  ["player",    "disableCast",      "boolean"               ],
  ["player",    "muted",            "boolean"               ],
  ["analytics", "baseUrl",          "string"                ],
  ["analytics", "disabled",         "boolean",  "disable"   ],
  ["skin",      "disabled",         "boolean",  "disable"   ],
  ["skin",      "showMetadata",     "boolean",  "metadata"  ],
  ["skin",      "showWallClock",    "boolean",  "wallclock" ],
  ["skin",      "timeZone",         "string"                ],
] as const;

// Must contains all props, including the ones that are not for the player constructor
export const observableAttributes = [
  "assetpage",
  "audioOnly",
  "poster",
  "starttime",
  "source",
  ...playerOptionsAttributes.map(
    ([section, optionName, , attrName = optionName.toLowerCase()]) => {
      return section === "player" ? attrName : `${section}-${attrName}`;
    }
  ),
];

export async function fetchAssetPageDetails(assetPage: string): Promise<{
  assetId: string;
  customer: string;
  businessUnit: string;
  exposureBaseUrl: string;
}> {
  const url = new URL(assetPage);
  const isLocalhost = url.origin.includes("localhost");
  const baseUrl = isLocalhost ? defaultBaseURL : url.origin;
  const configURL = `${baseUrl}/v2/whitelabel/origin/${url.hostname}/config/sandwich`;
  const response = await fetch(configURL);
  const { customer, businessUnit, systemConfig } = await response.json();
  const exposureBaseUrl = systemConfig.playerUrl || defaultBaseURL;
  const path = url.pathname.split("/");
  const assetId = path[path.length - 1];
  return { assetId, customer, businessUnit, exposureBaseUrl };
}

export function parseOptions(attributes: NamedNodeMap) {
  const player: Partial<IRedBeePlayerOptions> = {};
  const analytics: IRedBeePlayerAnalyticsOptions = {};
  const skin: IRedBeePlayerSkinOptions = {};
  const options = { player, analytics, skin };

  playerOptionsAttributes.forEach(
    ([section, optionName, type, attrName = optionName.toLowerCase()]) => {
      const fullAttrName =
        section === "player" ? attrName : `${section}-${attrName}`;
      const value = attributes.getNamedItem(fullAttrName)?.value;
      if (value === undefined) {
        return;
      }
      // These conditions are needed for the TS compiler
      if (type === "string") {
        if (section === "player") {
          options[section][optionName] = value;
        }
        if (section === "analytics") {
          options[section][optionName] = value;
        }
        if (section === "skin") {
          options[section][optionName] = value;
        }
      }
      if (type === "boolean") {
        const booleanValue = stringToBoolean(value);
        if (booleanValue === undefined) {
          console.warn(
            `Ignoring invalid value "${value}" for boolean attribute "${fullAttrName}". Expected "true" or "false"`
          );
          return;
        }
        if (section === "player") {
          options[section][optionName] = booleanValue;
        }
        if (section === "analytics") {
          options[section][optionName] = booleanValue;
        }
        if (section === "skin") {
          options[section][optionName] = booleanValue;
        }
      }
    }
  );
  return options;
}

export function stringToBoolean(value: string) {
  // Emulate boolean attributes by treating "" as true:
  // https://lamplightdev.com/blog/2021/04/29/how-to-use-boolean-attributes-in-web-components/
  if (["true", "yes", ""].includes(value)) {
    return true;
  }
  if (["false", "no"].includes(value)) {
    return false;
  }
  // invalid value that must be handled
  return undefined;
}
