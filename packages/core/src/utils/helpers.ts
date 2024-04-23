// SPDX-FileCopyrightText: 2024 Red Bee Media Ltd <https://www.redbeemedia.com/>
//
// SPDX-License-Identifier: MIT

import { MediaFormatType } from "@ericssonbroadcastservices/rbm-ott-sdk";
import canAutoplay from "can-autoplay";

import {
  DRMType,
  KeySystem,
} from "@ericssonbroadcastservices/js-player-shared";

import { isAppleSafari, isLGTV, isSamsungTV } from "../device/common";
import { info } from "./logger";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
declare global {
  interface Window {
    WebKitMediaKeys: any;
  }
}

const VIDEO_TYPES = [
  'video/mp4; codecs="avc1.42E01E"',
  'audio/mp4; codecs="mp4a.40.2"',
  'video/mp2t; codecs="avc1.42E01E"',
  'video/mp2t; codecs="mp4a.40.2"',
];

export function isSupported(checkDrmSupport = false): Promise<void> {
  return new Promise((resolve, reject) => {
    let isDeviceSupported: boolean | undefined;
    if (window.MediaSource) {
      VIDEO_TYPES.forEach((type) => {
        const isTypeSupported = window.MediaSource.isTypeSupported(type);
        info(`MimeType: ${type}, supported: ${isTypeSupported}`);
        if (isDeviceSupported === undefined) {
          isDeviceSupported = isTypeSupported;
        }
      });
    } else if (isNativeHlsSupported()) {
      isDeviceSupported = true;
    }
    if (isDeviceSupported && checkDrmSupport) {
      getSupportedDrm().then((drm) => {
        if (drm) {
          resolve();
        }
        reject();
      });
    } else if (isDeviceSupported) {
      resolve();
    } else {
      reject();
    }
  });
}

export function getSupportedFormats(): MediaFormatType[] {
  if (process.env.NODE_ENV === "development") {
    if (window.__RED_BEE_MEDIA__?.supportedFormats) {
      return window.__RED_BEE_MEDIA__.supportedFormats;
    }
  }
  if (isAppleSafari()) {
    return ["HLS", "MP3", "MP4"];
  }
  return ["DASH", "HLS", "SMOOTHSTREAMING", "MP3", "MP4"];
}

function getTestRobustness(keySystem: string) {
  if (keySystem === KeySystem.WIDEVINE) {
    return "SW_SECURE_CRYPTO";
  }
  return "";
}

// The order matters! The first key system that is supported will be used.
// We _want_ to use PlayReady on Edge because it supports HEVC. However using PlayReady
// on edge breaks SSAI.
const DEFAULT_KEYSYSTEMS = [KeySystem.WIDEVINE, KeySystem.PLAYREADY];

export function getSupportedDrm(
  keySystem?: DRMType,
  codecs = "avc1.42E01E"
): Promise<DRMType | undefined> {
  if (
    isAppleSafari() &&
    window.WebKitMediaKeys &&
    (!keySystem || keySystem === DRMType.FAIRPLAY)
  ) {
    return Promise.resolve(DRMType.FAIRPLAY);
  }
  if (navigator.requestMediaKeySystemAccess) {
    const promises: Promise<DRMType | undefined>[] = [];
    let keySystems: DRMType[] = DEFAULT_KEYSYSTEMS;
    if (keySystem) {
      keySystems = [keySystem];
    }

    keySystems.forEach((keySystem) => {
      const tmp = navigator
        .requestMediaKeySystemAccess(keySystem, [
          {
            videoCapabilities: [
              {
                robustness: getTestRobustness(keySystem),
                contentType: `video/mp4; codecs="${codecs}"`,
              },
            ],
          },
        ])
        .then((access) => access.createMediaKeys())
        .then(
          () => {
            switch (keySystem) {
              case KeySystem.WIDEVINE:
                return DRMType.WIDEVINE;
              case KeySystem.PLAYREADY:
                return DRMType.PLAYREADY;
              default:
                return;
            }
          },
          () => undefined
        );
      promises.push(tmp);
    });
    return Promise.all(promises).then((arr) => {
      const supportedDrm = arr.find((drm) => !!drm);
      return supportedDrm;
    });
  }
  return Promise.resolve(undefined);
}

export function isNativeHlsSupported(): boolean {
  if (isAppleSafari()) {
    try {
      return !!document
        .createElement("video")
        .canPlayType("application/vnd.apple.mpegurl");
    } catch (e) {
      return false;
    }
  }
  return false;
}

function delay(ms: number) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

export async function isVolumeReadOnly() {
  const video = document.createElement("video");
  video.volume = 1; // make sure volume is set to 1
  video.volume = 0.5;

  // on ipad the volume is read-only however instead of doing nothing when setting the volume
  // it will be correctly set however it will be reverted the next tick so we need to wait for that
  // to happen before we can check if the volume is read-only.
  await delay(0);

  return video.volume === 1;
}

export function isMSESupported(): boolean {
  return !!window.MediaSource;
}

/**
 * Check if autoplay is supported
 * @param  {Boolean}  muted optional parameter, useful if the attempted playback is muted
 * @return {Promise}
 */
export async function isAutoplaySupported(muted?: boolean): Promise<boolean> {
  if (isSamsungTV() || isLGTV()) {
    // canAutoplay doesn't work properly on these devices & we know autoplay is supported so no need to validate it.
    return true;
  }
  try {
    return (await canAutoplay.video({ muted: !!muted, inline: true })).result;
  } catch (_) {
    return false;
  }
}

export function isIframe() {
  try {
    return window.self !== window.top;
  } catch (e) {
    // if accessing window.top throws an error we're definitely in an iframe
    return true;
  }
}

export function getIframeURL(): URL | undefined {
  if (isIframe()) {
    try {
      const url = document.referrer || window.top?.location.href;
      if (url) {
        return new URL(url);
      }
    } catch (e) {
      // no-op
    }
  }
}
