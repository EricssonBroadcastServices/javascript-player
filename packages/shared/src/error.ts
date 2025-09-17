// SPDX-FileCopyrightText: 2024 Red Bee Media Ltd <https://www.redbeemedia.com/>
//
// SPDX-License-Identifier: MIT

export const ErrorTypes = {
  GENERIC: "GENERIC",
  OPTIONS: "INIT_OPTIONS",
  ABORTED: "ABORTED",
  API_AUTH: "AUTH_FAILED",
  API_AUTH_ANON: "AUTH_ANON_FAILED",
  API_PLAY_REQUEST: "PLAY_REQUEST_FAILED",
  API_ASSET: "ASSET_REQUEST_FAILED",
  DECODE: "DECODE_ERROR",
  DRM: "DRM_ERROR",
  NETWORK: "NETWORK_ERROR",
  STREAM_NOT_AVAILABLE: "STREAM_NOT_AVAILABLE",
  STREAM_LIMIT: "STREAM_LIMIT_REACHED",
  NOT_AUTHENTICATED: "SESSION_NOT_AUTHENTICATED",
  NOT_AUTHORIZED: "UNAUTHORIZED",
  GEO_LOCATION: "GEOLOCATION",
  MANIFEST: "MANIFEST_ERROR",
  SEGMENT: "SEGMENT_ERROR",
  MEDIA: "MEDIA_ERROR",
  CODEC: "CODEC",
  CAST: "CAST",
  PLAYER_ENGINE: "GENERIC_PLAYERENGINE_ERROR",
  UNSUPPORTED_DEVICE: "UNSUPPORTED_DEVICE",
  UNSUPPORTED_SCREEN: "UNSUPPORTED_SCREEN",
  OTHER: "OTHER_ERROR",
  DESTROYED: "DESTROYED",
  SRC_NOT_SUPPORTED: "SOURCE_NOT_SUPPORTED",
} as const;

export type ErrorTypes = (typeof ErrorTypes)[keyof typeof ErrorTypes];

type errorMetadata = {
  type: ErrorTypes;
  code?: number;
  rawError?: any;
  [name: string]: any;
};

export class PlayerError extends Error {
  category = "PLAYER";
  metadata: errorMetadata;
  constructor(message: string, { type, code, rawError }: errorMetadata) {
    super(message);
    this.message = message;
    this.metadata = {
      type,
      ...(Number.isFinite(code) && { code }),
      ...(rawError && { rawError }),
    };
  }
  toString() {
    const metadataString = Object.entries(this.metadata)
      .filter(([type]) => type !== "rawError")
      .map((pair) => pair.join(": "))
      .join(", ");
    return `${this.category} Error: ${this.message} {${metadataString}}`;
  }
}

export class APIError extends PlayerError {
  readonly category = "API";
}

export class UserError extends PlayerError {
  readonly category = "USER";
}

export class InitError extends PlayerError {
  readonly category = "INIT";
}

export class DashJsPlayerError extends PlayerError {
  readonly category = "DASHJS";
}

export class HlsJsPlayerError extends PlayerError {
  readonly category = "HLSJS";
}

export class ShakaPlayerError extends PlayerError {
  readonly category = "SHAKAPLAYER";
}

export class BitmovinPlayerError extends PlayerError {
  readonly category = "BITMOVIN";
}
