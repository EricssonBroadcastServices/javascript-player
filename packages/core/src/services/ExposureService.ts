// SPDX-FileCopyrightText: 2024 Red Bee Media Ltd <https://www.redbeemedia.com/>
//
// SPDX-License-Identifier: MIT

import {
  AdTrackingEvents,
  AnonymousSessionResponse,
  Asset,
  DeviceType,
  LoginResponse,
  MediaFormatType,
  PlayResponse,
  ServiceContext,
  getAsset,
  login,
  loginAnonymous,
  play,
} from "@ericssonbroadcastservices/rbm-ott-sdk";

import {
  APIError,
  DRMType,
  ErrorTypes,
  IAdsOptions,
  InitError,
} from "@ericssonbroadcastservices/js-player-shared";

import { getDevice } from "../device";
import { isLGTV } from "../device/common";

interface IExposureServiceOptions {
  customer: string;
  businessUnit: string;
  baseUrl: string;
}

type DRM = "fairplay" | "widevine" | "playready";

export interface IPlayRequestOptions {
  assetId: string;
  sessionToken: string;
  adsOptions?: IAdsOptions;
  audioOnly?: boolean;
  adobePrimetimeToken?: string;
  maxResolution?: string;
  supportedFormatTypes?: MediaFormatType[];
  supportedKeySystem?: DRMType;
  materialProfile?: string;
  start?: number;
  end?: number;
}

const KeySystemDrmMap = {
  "com.apple.fps": "fairplay",
  "com.widevine.alpha": "widevine",
  "com.microsoft.playready": "playready",
} as const;

export type AuthLoginOptions = {
  username: string;
  password: string;
};

export class ExposureService {
  private context: ServiceContext;

  private sessionToken?: string;

  constructor({ customer, businessUnit, baseUrl }: IExposureServiceOptions) {
    this.context = {
      customer,
      businessUnit,
      baseUrl,
      async errorFactory(response: Response) {
        const responseBody = await response.json();
        const url = new URL(response.url);
        const message = `HTTP Error: ${responseBody.message} (${response.status})`;
        let errType: ErrorTypes = ErrorTypes.OTHER;
        if (url.pathname.endsWith("/auth/anonymous")) {
          errType = ErrorTypes.API_AUTH_ANON;
        } else if (url.pathname.endsWith("/auth/login")) {
          errType = ErrorTypes.API_AUTH;
        } else if (url.pathname.endsWith("/play")) {
          errType = ErrorTypes.API_PLAY_REQUEST;
        } else if (response.url.includes("/content/asset/")) {
          errType = ErrorTypes.API_ASSET;
        }
        throw new APIError(message, { type: errType, code: response.status });
      },
    };

    if (!customer || !businessUnit) {
      throw new InitError("No Customer or BusinessUnit defined", {
        type: ErrorTypes.OPTIONS,
      });
    }
  }

  public async assetMetadata(assetId: string): Promise<Asset> {
    const headers = { Authorization: `Bearer ${this.sessionToken}` };
    return getAsset.call(this.context, { assetId, headers });
  }

  async authenticate<AuthOptions extends AuthLoginOptions | undefined>(
    authOptions?: AuthOptions
  ): Promise<
    AuthOptions extends AuthLoginOptions
      ? LoginResponse
      : AnonymousSessionResponse
  > {
    const deviceInfo = await getDevice();
    const deviceType: DeviceType =
      deviceInfo.type === "ctv" ? "SMART_TV" : "WEB";
    const device = { type: deviceType, name: deviceInfo.name };

    if (authOptions?.username) {
      return login.call(this.context, {
        ...authOptions,
        device: { deviceId: deviceInfo.id, ...device },
      });
    }
    return loginAnonymous.call(this.context, {
      device,
      deviceId: deviceInfo.id,
    });
  }

  public async playRequest({
    assetId,
    sessionToken,
    adsOptions,
    audioOnly,
    adobePrimetimeToken,
    maxResolution,
    supportedFormatTypes,
    supportedKeySystem,
    materialProfile,
    start,
    end,
  }: IPlayRequestOptions): Promise<PlayResponse> {
    if (!sessionToken && !this.sessionToken) {
      throw new InitError("No sessionToken exists", {
        type: ErrorTypes.OPTIONS,
      });
    }

    const supportedFormats = (supportedFormatTypes || []).flatMap((format) => {
      switch (format) {
        case "DASH":
          return "dash";
        case "HLS":
          return "hls";
        case "MP3":
          return "mp3";
        case "SMOOTHSTREAMING":
          return "mss";
        default:
          return [];
      }
    });

    const supportedDrms: DRM[] = [];
    if (supportedKeySystem) {
      supportedDrms.push(KeySystemDrmMap[supportedKeySystem]);
    }

    const headers = {
      Authorization: `Bearer ${sessionToken || this.sessionToken}`,
      ...(adobePrimetimeToken && {
        "X-Adobe-Primetime-MediaToken": adobePrimetimeToken,
      }),
    };

    const playResponse = await play.call(this.context, {
      ...adsOptions,
      headers,
      assetId,
      audioOnly,
      maxResolution,
      materialProfile,
      supportedFormats: supportedFormats
        ? supportedFormats.join(",")
        : undefined,
      supportedDrms: supportedDrms ? supportedDrms.join(",") : undefined,
      start,
      end,
    });
    return this.parsePlayResponse(playResponse);
  }

  private parsePlayResponse(playResponse: PlayResponse): PlayResponse {
    const restrictions = playResponse?.contractRestrictions;
    if (restrictions?.maxBitrate) {
      restrictions.maxBitrate *= 1000;
    }
    if (restrictions?.minBitrate) {
      restrictions.minBitrate *= 1000;
    }
    // TODO: EMP-18317 remove this if statement once LG/Nowtilus supports https again...
    // 😐🔫 Workaround to enable playback on LG 2017-2019 TVs, certain Root CAs
    // aren't allowed on these devices...
    if (
      isLGTV() &&
      playResponse.streamInfo?.ssai &&
      playResponse.ads?.stitcher === "NOWTILUS"
    ) {
      playResponse.ads?.clips?.forEach((clip) => {
        clip.impressionUrlTemplates?.forEach((impression, index) => {
          if (clip.impressionUrlTemplates) {
            clip.impressionUrlTemplates[index] = impression.replace(
              "https://",
              "http://"
            );
          }

          if (clip.trackingEvents) {
            for (const trackingEvent in clip.trackingEvents) {
              const event =
                clip.trackingEvents[trackingEvent as keyof AdTrackingEvents];

              event?.forEach((url, index) => {
                event[index] = url.replace("https://", "http://");
              });
            }
          }
        });
      });

      playResponse.formats?.forEach((format) => {
        if (format.vastUrl) {
          format.vastUrl = format.vastUrl.replace("https://", "http://");
        }
        format.mediaLocator = format.mediaLocator?.replace(
          "https://",
          "http://"
        );
      });
    }
    return playResponse;
  }
}
