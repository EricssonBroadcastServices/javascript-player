// SPDX-FileCopyrightText: 2024 Red Bee Media Ltd <https://www.redbeemedia.com/>
//
// SPDX-License-Identifier: MIT

import { LogLevel, Logger } from "@ericssonbroadcastservices/js-player-shared";

const logger = new Logger({
  prefix: "[PlayerCore]",
});

export function setLogLevel(logLevel: LogLevel) {
  logger.setLogLevel(logLevel);
}

export function debug(...args: any[]) {
  logger.debug(...args);
}

export function info(...args: any[]) {
  logger.info(...args);
}

export function warn(...args: any[]) {
  logger.warn(...args);
}

export function error(...args: any[]) {
  logger.error(...args);
}
