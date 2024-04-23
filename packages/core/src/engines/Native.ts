// SPDX-FileCopyrightText: 2024 Red Bee Media Ltd <https://www.redbeemedia.com/>
//
// SPDX-License-Identifier: MIT

import { DrmUrls } from "@ericssonbroadcastservices/rbm-ott-sdk";
import { parseURL } from "url-toolkit";

import {
  ErrorTypes,
  KeySystem,
  PlayerError,
  Track,
  arrayToString,
  getLabel,
  stringToArray,
} from "@ericssonbroadcastservices/js-player-shared";

import { InstanceSettingsInterface } from "../utils/interfaces";
import { debug } from "../utils/logger";
/* global WebKitMediaKeys */
import {
  AbstractBaseEngine,
  SUPPORTED_TEXT_TRACK_KINDS,
} from "./AbstractBaseEngine";
import {
  EngineEvents,
  HTMLMediaEvent,
  IHTMLMediaAudioTrack,
  MetadataEngineEvent,
  TLoadParameters,
} from "./interfaces";
import { IHLSPlaylist, getPlaylists } from "./utils/hls";
import { convertError, convertMediaKeyError } from "./utils/NativeErrors";

const BITRATE_POLL_INTERVAL = 10 * 1000;

function createTextTrack(track: IHTMLMediaAudioTrack | TextTrack): Track {
  return {
    id: track.language,
    language: track.language || getLabel(track.language),
    kind: track.kind,
    label: track.label,
  };
}

export class Native extends AbstractBaseEngine {
  readonly name = "Native HTML Video";
  readonly playertechVersion = "N/A";

  private drmInfo?: DrmUrls;
  private contentId?: string;
  private certificate?: Uint8Array;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private keySession?: any;
  private readonly authToken?: string;

  private lastBitrate?: number;
  private playlists?: IHLSPlaylist[];
  private bitrateInterval?: number;
  private startTime?: number;
  private src?: string;

  constructor(
    videoElement: HTMLVideoElement,
    instanceSettings: InstanceSettingsInterface
  ) {
    super(videoElement, instanceSettings);

    this.instanceSettings = instanceSettings;
    this.authToken =
      instanceSettings.playResponse?.playToken ??
      instanceSettings.initOptions.playToken;

    this.onNeedKey = this.onNeedKey.bind(this);
    this.onKeyMessage = this.onKeyMessage.bind(this);
    this.onKeyAdded = this.onKeyAdded.bind(this);
    this.onKeyError = this.onKeyError.bind(this);

    this.videoElement.setAttribute("playsinline", "");

    this.setupEventListeners();
  }

  private async _load({
    src,
    license,
    startTime,
    audio,
    subtitle,
  }: TLoadParameters) {
    const _super = {
      load: super.load.bind(this),
    };
    this.src = src;
    this.startTime = startTime;
    let drmEvaluationAndInitiationPromise: Promise<void>;
    if (license?.["com.apple.fps"]) {
      this.drmInfo = license["com.apple.fps"];
      const dataUrl = new URL(this.drmInfo.licenseServerUrl);
      this.contentId = dataUrl.searchParams.get("contentId") ?? undefined;
      drmEvaluationAndInitiationPromise = this.initDrmSetup();
    } else if (
      license?.["com.microsoft.playready"] ||
      license?.["com.widevine.alpha"]
    ) {
      const licenseType = license["com.microsoft.playready"]
        ? "playready"
        : "widevine";
      this.emit(
        EngineEvents.ERROR,
        new PlayerError(
          `[Native] drm ${licenseType} is not supported, fairplay not provided`,
          {
            type: ErrorTypes.DRM,
            rawError: license,
          }
        )
      );
      return;
    } else {
      drmEvaluationAndInitiationPromise = Promise.resolve();
    }

    return drmEvaluationAndInitiationPromise.then(
      () => {
        this.videoElement.src = src;
        this.videoElement.load();

        this.videoElement.textTracks.addEventListener(
          "addtrack",
          ({ track }: TrackEvent) => {
            if (track && track.kind === "metadata") {
              track.mode = "hidden";
              track.addEventListener("cuechange", async (evt) => {
                const metadataEvent: MetadataEngineEvent = {
                  event: evt,
                  engineName: "Native HTML Video",
                };
                this.emit(EngineEvents.METADATA_EVENT, metadataEvent);
              });
            }
          }
        );

        _super.load({
          src,
          license,
          startTime,
          audio,
          subtitle,
        });
      },
      (error) => {
        if (error instanceof PlayerError) {
          this.emit(EngineEvents.ERROR, error);
        } else {
          this.emit(
            EngineEvents.ERROR,
            new PlayerError("[Native] could not initiate drm", {
              type: ErrorTypes.DRM,
              rawError: error,
            })
          );
        }
      }
    );
  }

  load(loadParameters: TLoadParameters) {
    // load doesn't return a promise but since we want to use async/await we call a private method
    // noinspection JSIgnoredPromiseFromCall
    this._load(loadParameters);
  }

  onLoaded() {
    const startDate = this.videoElement.getStartDate?.();
    if (startDate && !isNaN(startDate.getTime())) {
      this.setUTCStartTime(startDate.getTime());
    }
    if (this.startTime !== undefined) {
      this.videoElement.currentTime = this.startTime;
    }
    if (this.src && this.src.includes(".m3u8")) {
      getPlaylists(this.src).then((playlists) => {
        this.playlists = playlists;
        this.startBitratePoll();
      });
    }
    super.onLoaded();
  }

  onSeeking() {
    if (this.isSeekDisabled) {
      const delta = this.videoElement.currentTime - this.supposedCurrentTime;
      if (Math.abs(delta) > 0.01) {
        this.seekTo(this.supposedCurrentTime);
      }
      return;
    }
    super.onSeeking();
  }

  private async initDrmSetup() {
    this.addVideoEventListener("webkitneedkey", this.onNeedKey);
    this.certificate = await this.getCertificate();
  }

  private async getCertificate(): Promise<Uint8Array> {
    this.emit(EngineEvents.DRM_UPDATE, "FAIRPLAY_CERTIFICATE_REQUEST");
    const certificateUrl = this.drmInfo?.certificateUrl;

    if (!certificateUrl) {
      return Promise.reject(
        new PlayerError("Missing Fairplay certificate url", {
          type: ErrorTypes.DRM,
        })
      );
    }

    try {
      const response = await fetch(certificateUrl, {
        method: "GET",
        headers: {
          Pragma: "Cache-Control: no-cache",
          "Cache-Control": "max-age=0",
        },
      });

      if (!response.ok) {
        // noinspection ExceptionCaughtLocallyJS
        throw new PlayerError("The Fairplay certificate could not be fetched", {
          type: ErrorTypes.DRM,
        });
      }

      const blob = await response.arrayBuffer();
      return new Uint8Array(blob);
    } catch (error) {
      this.emit(EngineEvents.DRM_UPDATE, "FAIRPLAY_CERTIFICATE_ERROR");

      throw new PlayerError("The Fairplay certificate could not be fetched", {
        type: ErrorTypes.DRM,
      });
    }
  }

  private async getLicense(event: MediaKeyMessageEvent) {
    this.emit(EngineEvents.DRM_UPDATE, "FAIRPLAY_LICENSE_REQUEST");
    const licenseUrl = this.drmInfo?.licenseServerUrl;

    if (!licenseUrl) {
      return Promise.reject(
        new PlayerError("Missing Fairplay license url", {
          type: ErrorTypes.DRM,
        })
      );
    }

    try {
      const { target: session, message } = event;

      if (!session) {
        return Promise.reject(
          new PlayerError("MediaKeySession not found", {
            type: ErrorTypes.DRM,
          })
        );
      }

      const response = await fetch(licenseUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/octet-stream",
          Authorization: `Bearer ${this.authToken}`,
        },
        body: message,
      });

      if (!response.ok) {
        // noinspection ExceptionCaughtLocallyJS
        throw new PlayerError("The Fairplay license could not be fetched", {
          type: ErrorTypes.DRM,
        });
      }

      const blob = await response.arrayBuffer();
      const license = new Uint8Array(blob);

      // noinspection ES6MissingAwait
      (session as MediaKeySession).update(license);

      this.emit(EngineEvents.DRM_UPDATE, "FAIRPLAY_LICENSE_RESPONSE");

      return session;
    } catch (error) {
      this.emit(EngineEvents.DRM_UPDATE, "FAIRPLAY_LICENSE_ERROR");

      throw new PlayerError("The Fairplay license could not be fetched", {
        type: ErrorTypes.DRM,
      });
    }
  }

  private concatInitDataIdAndCertificate(
    initData: Uint8Array,
    id: string | Uint16Array,
    cert: Uint8Array
  ) {
    if (typeof id === "string") {
      id = stringToArray(id);
    }
    // layout is [initData][4 byte: idLength][idLength byte: id][4 byte:certLength][certLength byte: cert]
    let offset = 0;
    const buffer = new ArrayBuffer(
      initData.byteLength + 4 + id.byteLength + 4 + cert.byteLength
    );
    const dataView = new DataView(buffer);

    const initDataArray = new Uint8Array(buffer, offset, initData.byteLength);
    initDataArray.set(initData);
    offset += initData.byteLength;

    dataView.setUint32(offset, id.byteLength, true);
    offset += 4;

    const idArray = new Uint16Array(buffer, offset, id.length);
    idArray.set(id);
    offset += idArray.byteLength;

    dataView.setUint32(offset, cert.byteLength, true);
    offset += 4;

    const certArray = new Uint8Array(buffer, offset, cert.byteLength);
    certArray.set(cert);

    return new Uint8Array(buffer, 0, buffer.byteLength);
  }

  private setupSession(
    keySystem: (typeof KeySystem)[keyof typeof KeySystem],
    initData: Uint8Array
  ) {
    if (!this.videoElement.webkitKeys) {
      this.videoElement.webkitSetMediaKeys(new WebKitMediaKeys(keySystem));
    }

    return this.videoElement.webkitKeys.createSession("video/mp4", initData);
  }

  private onNeedKey(event: MediaEncryptedEvent) {
    if (!this.drmInfo?.licenseServerUrl) {
      return;
    }
    const skd = arrayToString(event.initData);
    if (skd.includes("KID=")) {
      this.contentId = skd.substring(skd.indexOf("KID=") + 4);
    }
    // looking for dot as some kind of url detection
    if (skd.includes("skd://") && skd.includes(".") && !skd.startsWith(".")) {
      const dataArray = skd.split("skd://"); // since there could sometimes be strange encoded chars before skd we won't just do replace
      // proper url check
      if (parseURL(dataArray[1])) {
        this.drmInfo.licenseServerUrl = `https://${dataArray[1]}`;
        const dataUrl = new URL(this.drmInfo.licenseServerUrl);
        const { contentId } = Object.fromEntries(
          dataUrl.searchParams.entries()
        );

        // if we get relevant data, replace the data that we already have
        this.contentId = contentId || this.contentId;
      }
      // if not fetched by the if statement - move on as it might be a proper skd
    }
    const contentId = this.contentId;
    if (!contentId || !this.certificate) {
      throw "Could not create initData, contentId & certificate missing";
    }
    const initData = this.concatInitDataIdAndCertificate(
      event.initData as Uint8Array, // TODO: the legacy EME being used uses different types for certain things.
      contentId,
      this.certificate
    );
    this.keySession = this.setupSession(KeySystem.FAIRPLAY, initData);
    this.keySession.contentId = contentId;
    if (!this.keySession) {
      throw "Could not create key session";
    }
    this.keySession.addEventListener(
      "webkitkeyadded",
      this.onKeyAdded,
      this.keySession
    );
    this.keySession.addEventListener(
      "webkitkeyerror",
      this.onKeyError,
      this.keySession
    );
    this.keySession.addEventListener(
      "webkitkeymessage",
      this.onKeyMessage,
      false
    );
  }

  private onKeyMessage(event: MediaKeyMessageEvent) {
    this.getLicense(event)
      .then((data) => {
        debug("[Native] everything is well", data);
      })
      .catch((err) => {
        this.emit(EngineEvents.ERROR, err);
      });
  }

  private onKeyError() {
    const playerError = convertMediaKeyError(this.keySession);
    this.emit(EngineEvents.ERROR, playerError);
  }

  private onKeyAdded(event: Event) {
    debug("[Native] Decryption key was added to session.", event);
  }

  private getActivePlaylist() {
    if (!this.playlists?.length) {
      return;
    }
    const width = this.videoElement.videoWidth;
    const height = this.videoElement.videoHeight;

    return this.playlists.find(
      (playlist) => playlist.width === width && playlist.height === height
    );
  }

  private startBitratePoll() {
    if (!this.playlists?.length) {
      return;
    }
    this.bitrateInterval = window.setInterval(() => {
      const playlist = this.getActivePlaylist();
      if (playlist && playlist.bitrate !== this.lastBitrate) {
        this.lastBitrate = playlist.bitrate;

        this.emit(EngineEvents.BITRATE_CHANGED, {
          bitrate: playlist.bitrate,
          width: playlist.width,
          height: playlist.height,
        });
      }
    }, BITRATE_POLL_INTERVAL);
  }

  private stopBitratePoll() {
    clearInterval(this.bitrateInterval);
  }

  onError(error: HTMLMediaEvent) {
    this.stopBitratePoll();
    if (error) {
      const playerError = convertError(error);
      if (playerError) {
        this.emit(EngineEvents.ERROR, playerError);
      }
    }
  }

  setQualityLevel(): void {
    // not possible
  }

  getSubtitleTrack(): Track | undefined {
    const tracks: TextTrack[] = this.videoElement.textTracks
      ? Array.from(this.videoElement.textTracks)
      : [];
    if (!Array.isArray(tracks) || tracks.length === 0) return;
    const activeTrack = tracks.find(
      (track) =>
        track.mode === "hidden" &&
        SUPPORTED_TEXT_TRACK_KINDS.includes(track.kind)
    );
    if (activeTrack) {
      return createTextTrack(activeTrack);
    }
  }

  getSubtitleTracks(): Track[] {
    const internalTracks: TextTrack[] = this.videoElement.textTracks
      ? Array.from(this.videoElement.textTracks)
      : [];

    return this.filterVisibleSubtitleTracks(
      internalTracks
        .map((track) => createTextTrack(track))
        .filter(
          (track, index, array) =>
            array.findIndex(
              (compTrack) =>
                track.language === compTrack.language &&
                track.label === compTrack.label &&
                track.kind &&
                track.kind === compTrack.kind &&
                SUPPORTED_TEXT_TRACK_KINDS.includes(track.kind)
            ) === index
        )
    );
  }

  destroy() {
    this.stopBitratePoll();
    if (this.keySession) {
      this.keySession.close();
      this.keySession = null;
    }
    this.videoElement.removeAttribute("playsinline");
    super.destroy();
  }
}
