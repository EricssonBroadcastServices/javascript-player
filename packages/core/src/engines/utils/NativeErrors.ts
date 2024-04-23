// SPDX-FileCopyrightText: 2024 Red Bee Media Ltd <https://www.redbeemedia.com/>
//
// SPDX-License-Identifier: MIT

import {
  ErrorTypes,
  PlayerError,
} from "@ericssonbroadcastservices/js-player-shared";

import { HTMLMediaEvent } from "../interfaces";

// https://developer.mozilla.org/en-US/docs/Web/API/MediaError/code#media_error_code_constants
// https://github.com/WebKit/WebKit/blob/2556a110ed4c9447ed726dca20c919660743d701/Source/WebCore/html/MediaError.h#L34-L44
const MediaErrorMap: { [key: number]: ErrorTypes } = {
  1: ErrorTypes.ABORTED,
  2: ErrorTypes.NETWORK,
  3: ErrorTypes.DECODE,
  4: ErrorTypes.SRC_NOT_SUPPORTED,
  5: ErrorTypes.DRM,
};

type TMessageMap = { [key: number]: string };

const MediaKeyError: TMessageMap = {
  1: "MEDIA_KEYERR_UNKNOWN",
  2: "MEDIA_KEYERR_CLIENT",
  3: "MEDIA_KEYERR_SERVICE",
  4: "MEDIA_KEYERR_OUTPUT",
  5: "MEDIA_KEYERR_HARDWARECHANGE",
  6: "MEDIA_KEYERR_DOMAIN",
};

const SystemCodeError: TMessageMap = {
  1212433232: "UNSUPPORTED_SCREEN",
};

export const convertError = (errorEvent: HTMLMediaEvent): PlayerError => {
  const { error } = errorEvent.target;
  const { code, message } = error || { code: -1, message: "" };

  return new PlayerError(message, {
    type: MediaErrorMap[code] || ErrorTypes.OTHER,
    code,
    rawError: error,
  });
};

export const convertMediaKeyError = (keySession: any): PlayerError => {
  const error = keySession.error || {};
  const errorCode = error.code;
  const systemCode = error.systemCode;
  const message: string = SystemCodeError[systemCode]
    ? SystemCodeError[systemCode]
    : MediaKeyError[errorCode];

  return new PlayerError(`A decryption key error was encountered: ${message}`, {
    type: ErrorTypes.DRM,
    code: systemCode || errorCode,
    rawError: keySession.error,
  });
};
