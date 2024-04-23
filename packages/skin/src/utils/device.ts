// SPDX-FileCopyrightText: 2024 Red Bee Media Ltd <https://www.redbeemedia.com/>
//
// SPDX-License-Identifier: MIT

export function isMobileOS(): boolean {
  const mobileUserAgents =
    /iphone|ipod|ipad|android|blackberry|windows phone|iemobile|wpdesktop/;
  return mobileUserAgents.test(window.navigator.userAgent.toLowerCase());
}

export function isTouchDevice(): boolean {
  const hasTouchCapabilities = "ontouchstart" in document.documentElement;
  return hasTouchCapabilities;
}
