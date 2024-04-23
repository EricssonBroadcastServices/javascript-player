// SPDX-FileCopyrightText: 2024 Red Bee Media Ltd <https://www.redbeemedia.com/>
//
// SPDX-License-Identifier: MIT

import shaka from "shaka-player";

import {
  ErrorTypes,
  ShakaPlayerError,
} from "@ericssonbroadcastservices/js-player-shared";

const ErrorMap: { [key: string]: ErrorTypes } = {
  NETWORK: ErrorTypes.NETWORK,
  TEXT: ErrorTypes.SEGMENT,
  MEDIA: ErrorTypes.SEGMENT,
  MANIFEST: ErrorTypes.MANIFEST,
  STREAMING: ErrorTypes.MANIFEST,
  DRM: ErrorTypes.DRM,
  PLAYER: ErrorTypes.GENERIC,
  CAST: ErrorTypes.GENERIC,
  STORAGE: ErrorTypes.GENERIC,
} as const;

const nonFatalShakaErrorCodeKeys = [
  "INVALID_TEXT_HEADER",
  "INVALID_TEXT_CUE",
  "UNABLE_TO_DETECT_ENCODING",
  "BAD_ENCODING",
  "INVALID_XML",
  "INVALID_TTML",
  "INVALID_MP4_TTML",
  "INVALID_MP4_VTT",
];

export const convertError = (
  error: shaka.util.Error
): { error: ShakaPlayerError; fatal: boolean } => {
  // Set message from error code
  const codeIndex = Object.values(shaka.util.Error.Code).indexOf(error.code);
  const shakaErrorMessage = Object.keys(shaka.util.Error.Code)[codeIndex];

  // Set category from Shaka's defined categories
  const categoryIndex = Object.values(shaka.util.Error.Category).indexOf(
    error.category
  );
  const categoryName = Object.keys(shaka.util.Error.Category)[categoryIndex];

  const fatal =
    error.severity !== shaka.util.Error.Severity.RECOVERABLE &&
    !nonFatalShakaErrorCodeKeys.includes(shakaErrorMessage);

  return {
    error: new ShakaPlayerError(shakaErrorMessage, {
      type: ErrorMap[categoryName] || ErrorTypes.OTHER,
      code: error.code,
    }),
    fatal,
  };
};
