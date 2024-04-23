// SPDX-FileCopyrightText: 2024 Red Bee Media Ltd <https://www.redbeemedia.com/>
//
// SPDX-License-Identifier: MIT

import { EmitterBaseClass } from "@ericssonbroadcastservices/js-player-shared";

export const AirPlayEvent = {
  AVAILABILITY_CHANGED: "airplay:availability_changed",
  CONNECTED: "airplay:connected",
  DISCONNETED: "airplay:disconnected",
} as const;

type AirPlayEventsMap = {
  [AirPlayEvent.AVAILABILITY_CHANGED]: { available: boolean };
  [AirPlayEvent.CONNECTED]: undefined;
  [AirPlayEvent.DISCONNETED]: undefined;
};

export class AirPlay extends EmitterBaseClass<AirPlayEventsMap> {
  private video: HTMLVideoElement;

  private isEnabled = true;
  private isAvailable = false;
  private isBrowserSupported = false;

  constructor(video: HTMLVideoElement) {
    super();
    this.video = video;
    if (!(window as any).WebKitPlaybackTargetAvailabilityEvent) {
      this.isBrowserSupported = false;
      this.emit(AirPlayEvent.AVAILABILITY_CHANGED, { available: false });
    } else {
      this.isBrowserSupported = true;
      video.addEventListener(
        "webkitplaybacktargetavailabilitychanged",
        (this.onAvailabilityChanged = this.onAvailabilityChanged.bind(this))
      );
      video.addEventListener(
        "webkitcurrentplaybacktargetiswirelesschanged",
        (this.onTargetChanged = this.onTargetChanged.bind(this))
      );
    }
  }

  private onAvailabilityChanged({ availability }: any) {
    if (!this.isEnabled) {
      // Safari considers airplay available even if we've disabled it
      // however _only_ airplaying the audio is supported, since that is confusing
      // for users we disable it internally as well.
      return;
    }
    this.isAvailable = availability === "available";
    this.emit(AirPlayEvent.AVAILABILITY_CHANGED, {
      available: this.isAvailable,
    });
  }

  private onTargetChanged() {
    if ((this.video as any).webkitCurrentPlaybackTargetIsWireless) {
      this.emit(AirPlayEvent.CONNECTED, undefined);
      // workaround safari bug causing the video element to not receive some events
      // wait one tick and then play to trigger the video element to get events again
      setTimeout(() => {
        this.video.play();
      }, 0);
    } else {
      this.emit(AirPlayEvent.DISCONNETED, undefined);
    }
  }

  isSupported() {
    return this.isBrowserSupported;
  }

  enable() {
    this.isEnabled = true;
    this.video.removeAttribute("x-webkit-airplay");
    this.video.removeAttribute("x-webkit-wirelessvideoplaybackdisabled");

    this.emit(AirPlayEvent.AVAILABILITY_CHANGED, {
      available: this.isAvailable,
    });
  }

  disable() {
    this.isEnabled = false;
    this.video.setAttribute("x-webkit-airplay", "deny");
    this.video.setAttribute("x-webkit-wirelessvideoplaybackdisabled", "");

    this.emit(AirPlayEvent.AVAILABILITY_CHANGED, {
      available: false,
    });
  }

  public toggleAirPlay() {
    (this.video as any).webkitShowPlaybackTargetPicker();
  }

  public destroy() {
    this.video.removeEventListener(
      "webkitplaybacktargetavailabilitychanged",
      this.onAvailabilityChanged
    );
    this.video.removeEventListener(
      "webkitcurrentplaybacktargetiswirelesschanged",
      this.onTargetChanged
    );
  }
}
