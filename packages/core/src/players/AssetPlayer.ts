// SPDX-FileCopyrightText: 2024 Red Bee Media Ltd <https://www.redbeemedia.com/>
//
// SPDX-License-Identifier: MIT

import {
  MarkerPoint,
  MediaFormat,
} from "@ericssonbroadcastservices/rbm-ott-sdk";

import {
  APIError,
  ErrorTypes,
  InitError,
  PlayerEvents,
} from "@ericssonbroadcastservices/js-player-shared";

import { getBrowser, isLGTV } from "../device/common";
import { AbstractBaseEngine } from "../engines/AbstractBaseEngine";
import { DashJs } from "../engines/DashJs";
import { HlsJs } from "../engines/HlsJs";
import { Native } from "../engines/Native";
import { Shaka } from "../engines/Shaka";
import {
  getSupportedFormats,
  isMSESupported,
  isNativeHlsSupported,
} from "../utils/helpers";
import {
  AudioIdentifier,
  InstanceSettingsInterface,
  TextIdentifier,
} from "../utils/interfaces";
import { getPreferences } from "../utils/preferences";
import { BasePlayer } from "./BasePlayer";

export class AssetPlayer extends BasePlayer {
  private emittedContentMarkers: string[] = [];

  constructor(
    videoElement: HTMLVideoElement,
    subtitleContainer: HTMLDivElement,
    instanceSettings: InstanceSettingsInterface,
    source?: string
  ) {
    super(videoElement, subtitleContainer, instanceSettings, source, {
      contentMarkers: instanceSettings.assetMetadata?.markerPoints || [],
    });
  }

  /**
   * Get the preferred audio & text langauges for media playback.
   * Defaults to stored user preferences but fallsback to the player
   * locale when applicable.
   */
  protected getPreferredLanguages(): {
    audio?: AudioIdentifier;
    subtitle?: TextIdentifier;
  } {
    const userPreferences = getPreferences();
    const audioTracks = this.instanceSettings.assetMetadata?.audioTracks ?? [];
    const subtitles = this.instanceSettings.assetMetadata?.subtitles ?? [];
    const locale = this.instanceSettings.initOptions.locale;

    // if the users preferred audio/subtitle does not exist the logic below should act as if there was no preference.
    let subtitle =
        userPreferences.subtitle &&
        // if the preferences contain a subtitle preference without any language
        // it means that the user have disabled subtitles.
        (!userPreferences.subtitle.language ||
          !subtitles.length || // if we have no subtitles to test against we let the engine decide.
          subtitles.includes(userPreferences.subtitle.language))
          ? userPreferences.subtitle
          : undefined,
      audio =
        userPreferences.audio?.language &&
        (!audioTracks.length || // if we have no audio tracks to test against we let the engine decide.
          audioTracks.includes(userPreferences.audio.language))
          ? userPreferences.audio
          : undefined;

    if (locale) {
      // if there is no audio preference AND the value of `locale` exist as an audioTrack
      // set the preferred language to `locale`.
      if (!audio && audioTracks.includes(locale)) {
        audio = { language: locale, kind: "main" };
      }

      // if there is no subtitle preference AND the `locale` exist as a subtitle AND there is no preferred audio OR the
      // preferred audio is NOT the same language as `locale`` then set the preferred subtitle language to `locale`.
      if (
        !subtitle &&
        subtitles.includes(locale) &&
        (!audio || audio.language !== locale)
      ) {
        subtitle = { language: locale, kind: "subtitles" };
      }
    }

    return {
      audio,
      subtitle,
    };
  }

  getPlayerEngine(): AbstractBaseEngine {
    const { format, mediaLocator, drm, liveDelay } = this.getFormat();

    this.mediaLocator = mediaLocator;
    this.license = drm;
    this.playbackFormat = format;

    if (process.env.NODE_ENV === "development") {
      const devEngine = this.getPlayerEngineDev();
      if (devEngine) {
        return devEngine;
      }
    }

    switch (format) {
      case "HLS":
        if (
          this.instanceSettings.mediaInfo?.isLive &&
          !this.license &&
          liveDelay &&
          isMSESupported()
        ) {
          return new HlsJs(this.videoElement, this.instanceSettings);
        }
        if (isNativeHlsSupported()) {
          return new Native(this.videoElement, this.instanceSettings);
        }
        return new HlsJs(this.videoElement, this.instanceSettings);
      case "DASH":
        if (isLGTV() || getBrowser() === "firefox") {
          return new DashJs(this.videoElement, this.instanceSettings);
        }
        return new Shaka(this.videoElement, this.instanceSettings);
      case "SMOOTHSTREAMING":
        return new DashJs(this.videoElement, this.instanceSettings);
      case "MP4":
      case "MP3":
        return new Native(this.videoElement, this.instanceSettings);
      default:
        throw new InitError(`Support for ${format} not yet implemented`, {
          type: ErrorTypes.OPTIONS,
        });
    }
  }

  checkifActiveMarker(
    contentMarker: MarkerPoint,
    markerId: string,
    startEvent:
      | typeof PlayerEvents.INTRO_START
      | typeof PlayerEvents.CHAPTER_START
      | typeof PlayerEvents.MARKER,
    endEvent?: typeof PlayerEvents.INTRO_END | typeof PlayerEvents.CHAPTER_END
  ) {
    const { offset, endOffset } = contentMarker;
    const isAlreadyEmitted = this.emittedContentMarkers.includes(markerId);
    const currentTime = this.getCurrentTime() * 1000;

    if (
      !isAlreadyEmitted &&
      endOffset &&
      currentTime > offset &&
      currentTime < endOffset
    ) {
      this.emit(startEvent, { ...this.getDefaultPlayerEvent(), contentMarker });
      this.emittedContentMarkers.push(markerId);
    } else if (
      isAlreadyEmitted &&
      endOffset &&
      endEvent &&
      (currentTime > endOffset || currentTime < offset)
    ) {
      this.emit(endEvent, { ...this.getDefaultPlayerEvent(), contentMarker });
      this.emittedContentMarkers = this.emittedContentMarkers.filter(
        (ecm) => ecm !== markerId
      );
    } else if (!isAlreadyEmitted && !endOffset && currentTime > offset) {
      //you are markerPoint or credit
      this.emittedContentMarkers.push(markerId);
      this.emit(startEvent, { ...this.getDefaultPlayerEvent(), contentMarker });
    } else if (isAlreadyEmitted && !endOffset && currentTime < offset) {
      this.emittedContentMarkers = this.emittedContentMarkers.filter(
        (ecm) => ecm !== markerId
      );
    }
  }

  evaluateContentMarkers() {
    const contentMarkers = this.getContentMarkers();

    contentMarkers?.forEach((contentMarker, i) => {
      const markerId = `${contentMarker.type}_${i}`;
      switch (contentMarker.type) {
        case "INTRO":
          this.checkifActiveMarker(
            contentMarker,
            markerId,
            PlayerEvents.INTRO_START,
            PlayerEvents.INTRO_END
          );
          break;
        case "CHAPTER":
          this.checkifActiveMarker(
            contentMarker,
            markerId,
            PlayerEvents.CHAPTER_START,
            PlayerEvents.CHAPTER_END
          );
          break;
        default:
          this.checkifActiveMarker(
            contentMarker,
            markerId,
            PlayerEvents.MARKER
          );
          break;
      }
    });
  }

  onTimeUpdate() {
    super.onTimeUpdate();
    this.evaluateContentMarkers();
  }

  protected getFormat(): MediaFormat {
    const availableFormats = this.instanceSettings.formats || [];
    const preferredFormats = this.instanceSettings.initOptions.preferredFormats;

    const supportedFormatTypes = getSupportedFormats();
    const supportedFormats = availableFormats.filter(({ format }) =>
      supportedFormatTypes.includes(format)
    );
    const isDrm = this.isDrm(availableFormats);
    if (isDrm && !this.instanceSettings.supportedKeySystem) {
      const errMessage =
        "Asset is DRM, though no supported key systems reported by the browser";
      const noSupportedKeySystemError = new InitError(errMessage, {
        type: ErrorTypes.DRM,
      });
      this.emit(PlayerEvents.ERROR, noSupportedKeySystemError);
      throw noSupportedKeySystemError;
    }
    const decider = isDrm
      ? this.decideEncryptedFormatToPlay.bind(this)
      : this.decideNonEncryptedFormatToPlay.bind(this);
    let format: MediaFormat | undefined = decider(
      supportedFormats,
      preferredFormats
    );

    if (!format && supportedFormats.length > 0) {
      format = supportedFormats[0];
    }
    if (!format) {
      const errMsg = `Could not match requested formats: ${preferredFormats}`;
      throw new APIError(errMsg, {
        type: ErrorTypes.API_PLAY_REQUEST,
      });
    }
    return format;
  }

  decideEncryptedFormatToPlay(
    formats: MediaFormat[],
    preferredFormats: string[] = []
  ): MediaFormat | undefined {
    let format: MediaFormat | undefined;
    const preferredKeysystem = this.instanceSettings.initOptions?.keysystem;
    if (preferredKeysystem) {
      format = formats.find((f) =>
        Object.keys(f.drm ?? {}).find(
          (k) => k === (preferredKeysystem as string)
        )
      );
    } else {
      for (const preferredFormat of preferredFormats) {
        format = formats.find((f) => {
          if (f.drm && isNativeHlsSupported()) {
            return f.format === "HLS";
          }
          if (f.drm && !isNativeHlsSupported()) {
            return (
              f.format === preferredFormat.toUpperCase() && f.format !== "HLS"
            );
          }
        });
        if (format) {
          break;
        }
      }
    }
    return format;
  }

  decideNonEncryptedFormatToPlay(
    formats: MediaFormat[],
    preferredFormats: string[] = []
  ): MediaFormat | undefined {
    let format: MediaFormat | undefined;
    for (const preferredFormat of preferredFormats) {
      format = formats.find((f) => {
        return f.format === preferredFormat.toUpperCase();
      });
      if (format) {
        break;
      }
    }
    return format;
  }

  isDrm(formats: MediaFormat[]): boolean {
    return !!formats.find((f) => f.drm);
  }

  isSeekable() {
    const contractRestrictions =
      this.instanceSettings.playResponse?.contractRestrictions;

    if (contractRestrictions) {
      const { timeshiftEnabled, ffEnabled, rwEnabled } = contractRestrictions;
      return timeshiftEnabled === false ||
        (rwEnabled === false && ffEnabled === false)
        ? false
        : super.isSeekable();
    }
    return super.isSeekable();
  }
}
