// SPDX-FileCopyrightText: 2024 Red Bee Media Ltd <https://www.redbeemedia.com/>
//
// SPDX-License-Identifier: MIT

/// <reference types="tizen-common-web" />
/// <reference types="tizen-tv-webapis" />

import { TBrowser } from "@ericssonbroadcastservices/js-player-shared";

interface SharedWindow extends Window {
  webOS?: {
    platform: {
      tv?: boolean;
    };
  };
}

declare const window: SharedWindow;

const DesktopBrowserMaintained: { [key in TBrowser]: number | false } = {
  firefox: 85,
  chrome: 88,
  edge: 88,
  safari: 13,
  unknown: false,
};

const MobileBrowserMaintained: { [key in TBrowser]: number | false } = {
  firefox: false,
  chrome: 88,
  safari: 13,
  edge: false,
  unknown: false,
};

export function isLGTV() {
  return !!window.webOS?.platform?.tv;
}

export function isSamsungTV() {
  return !!(window.tizen && window.webapis);
}

export function getOS() {
  const userAgent = window.navigator.userAgent.toLowerCase();
  if (/windows/.test(userAgent)) {
    return "Windows";
  } else if (/mac os/.test(userAgent)) {
    if (/iphone|ipod/.test(userAgent)) {
      return "iOS";
    }
    if (/ipad/.test(userAgent) || "ontouchstart" in document.documentElement) {
      return "iPadOS";
    }
    return "macOS";
  } else if (/android/.test(userAgent)) {
    return "Android";
  } else if (/linux/.test(userAgent)) {
    return "Linux";
  }
  return "unknown";
}

export function getBrowser(): TBrowser {
  const userAgent = window.navigator.userAgent.toLowerCase();
  if (/firefox/.test(userAgent)) {
    return "firefox";
  } else if (/edg/.test(userAgent) || /edga/.test(userAgent)) {
    return "edge";
  } else if (/chrome/.test(userAgent)) {
    return "chrome";
  } else if (
    /safari/.test(userAgent) &&
    /apple computer/.test(navigator.vendor.toLowerCase()) &&
    !/tizen/.test(userAgent) &&
    !/sopopenbrowser/.test(userAgent)
  ) {
    return "safari";
  }
  return "unknown";
}

export function getBrowserVersion(): number {
  const userAgent = window.navigator.userAgent.toLowerCase();
  const browser = getBrowser();
  let version = 0;
  if (browser === "firefox") {
    version = parseInt(userAgent.match(/firefox\/(\d+)/)?.[1] ?? "", 10);
  } else if (browser === "edge") {
    version =
      parseInt(userAgent.match(/edg\/(\d+)/)?.[1] ?? "", 10) ||
      parseInt(userAgent.match(/edga\/(\d+)/)?.[1] ?? "", 10);
  } else if (browser === "chrome") {
    version = parseInt(userAgent.match(/chrome\/(\d+)/)?.[1] ?? "", 10);
  } else if (browser === "safari") {
    version = parseInt(userAgent.match(/version\/(\d+)/)?.[1] ?? "", 10);
  }
  return version;
}

/**
 * Get tizen version, returns 0 if not a tizen device or unsupported
 * @return {number}
 */
export function getTizenVersion(): number {
  let version = 0;
  const userAgent = window.navigator.userAgent.toLowerCase();
  if (isSamsungTV()) {
    version = parseFloat(userAgent.split(" tv")[0].split("/").pop() ?? "0");
  }
  return version;
}

export function isAppleSafari() {
  const os = getOS();
  return getBrowser() === "safari" || os === "iOS" || os === "iPadOS";
}

export function isBrowserSupported(): boolean {
  if (isSamsungTV() && getTizenVersion() >= 3) {
    return true;
  }
  if (isLGTV() && getBrowser() === "chrome" && getBrowserVersion() >= 38) {
    return true;
  }
  const os = getOS();
  const browser = getBrowser();
  const version = getBrowserVersion();
  const maintainedVersionMobile = MobileBrowserMaintained[browser];
  const maintainedVersionDesktop = DesktopBrowserMaintained[browser];
  if (
    os === "Android" &&
    maintainedVersionMobile &&
    version >= maintainedVersionMobile
  ) {
    return true;
  } else if (
    (os === "iOS" || os === "iPadOS") &&
    maintainedVersionMobile
    // There seem to be no reliable way of determininig Safari version
  ) {
    return true;
  } else if (
    (os === "Windows" || os === "macOS") &&
    maintainedVersionDesktop &&
    version >= maintainedVersionDesktop
  ) {
    return true;
  }
  return false;
}
