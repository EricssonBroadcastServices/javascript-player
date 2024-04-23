// SPDX-FileCopyrightText: 2024 Red Bee Media Ltd <https://www.redbeemedia.com/>
//
// SPDX-License-Identifier: MIT

export const LogLevel = {
  DEBUG: 0,
  INFO: 1,
  WARN: 2,
  ERROR: 3,
  NONE: 4,
} as const;
export type LogLevel = (typeof LogLevel)[keyof typeof LogLevel];

type LoggerOptions = {
  prefix: string;
  logLevel?: LogLevel;
};

export class Logger {
  private prefix: string;
  private initTime: number;

  public logLevel: LogLevel;

  constructor(options: LoggerOptions) {
    this.prefix = options.prefix;
    this.logLevel = options.logLevel ?? LogLevel.ERROR;
    this.initTime = Date.now();
  }

  setLogLevel(logLevel: LogLevel) {
    this.logLevel = logLevel;
  }

  debug(...args: any[]) {
    if (this.logLevel <= LogLevel.DEBUG) {
      console.debug(this.prefix, ...args, Date.now() - this.initTime);
    }
  }

  info(...args: any[]) {
    if (this.logLevel <= LogLevel.INFO) {
      console.info(this.prefix, ...args);
    }
  }

  warn(...args: any[]) {
    if (this.logLevel <= LogLevel.WARN) {
      console.warn(this.prefix, ...args);
    }
  }

  error(...args: any[]) {
    if (this.logLevel <= LogLevel.ERROR) {
      console.error(this.prefix, ...args);
    }
  }
}
