// SPDX-FileCopyrightText: 2024 Red Bee Media Ltd <https://www.redbeemedia.com/>
//
// SPDX-License-Identifier: MIT

export const VIEW_TYPE = {
  META_DATA_VIEW: "metaDataView",
  CONTENT_MARKERS_MENU: "contentMarkersMenu",
  SETTINGS_MENU: "settings",
} as const;
export type VIEW_TYPE = (typeof VIEW_TYPE)[keyof typeof VIEW_TYPE];
