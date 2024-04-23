// SPDX-FileCopyrightText: 2024 Red Bee Media Ltd <https://www.redbeemedia.com/>
//
// SPDX-License-Identifier: MIT

import { Asset } from "@ericssonbroadcastservices/rbm-ott-sdk";

import {
  getAssetImages,
  getAssetTitle,
} from "@ericssonbroadcastservices/js-player-shared";

import { INTERNAL_STATE_CHANGED } from "../players/AbstractPlayer";
import { AdInsertionPlayer } from "../players/AdInsertionPlayer";
import { AssetPlayer } from "../players/AssetPlayer";
import { BasePlayer } from "../players/BasePlayer";
import { LowLatencyPlayer } from "../players/LowLatencyPlayer";
import { InstanceSettingsInterface } from "./interfaces";

const ActionHandlers = {
  PLAY: "play",
  PAUSE: "pause",
  PREVIOUS_TRACK: "previoustrack",
  NEXT_TRACK: "nexttrack",
  SEEK_BACKWARD: "seekbackward",
  SEEK_FORWARD: "seekforward",
  SEEKTO: "seekto",
  STOP: "stop",
} as const;

export class MediaSessionManager {
  private playerInstance:
    | BasePlayer
    | AssetPlayer
    | LowLatencyPlayer
    | AdInsertionPlayer;
  private asset?: Asset;
  private customer?: string;

  private locale: string;

  constructor(
    playerInstance:
      | BasePlayer
      | AssetPlayer
      | LowLatencyPlayer
      | AdInsertionPlayer,
    instanceSettings: InstanceSettingsInterface
  ) {
    this.playerInstance = playerInstance;
    this.asset = instanceSettings.assetMetadata;
    this.customer = document.title || instanceSettings.initOptions.customer;
    this.locale = instanceSettings.initOptions.locale || "en";
    this.setup();
  }

  setup(): void {
    if ("mediaSession" in navigator) {
      this.setMetadata();
      this.setupEventListeners();
      this.setupStateReporter();
    }
  }

  setMetadata(): void {
    if (!this.asset) {
      return;
    }
    const title = getAssetTitle(this.asset, this.locale);
    const images = getAssetImages(this.asset, this.locale).map((image) => ({
      src: image.url,
      sizes: `${image.width}x${image.height}`,
    }));
    if (!title) return;
    navigator.mediaSession.metadata = new MediaMetadata({
      title,
      artist: this.customer,
      artwork: images,
    });
  }

  setupEventListeners(): void {
    // Wrap all setActionHandler in try/catch, see: https://github.com/w3c/mediasession/issues/228?ts=2
    try {
      navigator.mediaSession.setActionHandler(ActionHandlers.PLAY, async () => {
        await this.playerInstance.play();
        navigator.mediaSession.playbackState = "playing";
      });
    } catch (e) {
      // no-op
    }
    try {
      navigator.mediaSession.setActionHandler(ActionHandlers.PAUSE, () => {
        this.playerInstance.pause();
        navigator.mediaSession.playbackState = "paused";
      });
    } catch (e) {
      // no-op
    }

    try {
      navigator.mediaSession.setActionHandler(
        ActionHandlers.SEEK_BACKWARD,
        () => {
          this.playerInstance.scrub(-15);
        }
      );
    } catch (e) {
      // no-op
    }
    try {
      navigator.mediaSession.setActionHandler(
        ActionHandlers.SEEK_FORWARD,
        () => {
          this.playerInstance.scrub(15);
        }
      );
    } catch (e) {
      // no-op
    }

    try {
      navigator.mediaSession.setActionHandler(
        ActionHandlers.SEEKTO,
        ({ seekTime }) => {
          if (seekTime !== null) {
            this.playerInstance.seekTo(seekTime);
          }
        }
      );
    } catch (e) {
      // no-op
    }
  }

  setupStateReporter(): void {
    if (navigator.mediaSession?.setPositionState) {
      this.playerInstance.on(INTERNAL_STATE_CHANGED, (state) => {
        if (
          !this.playerInstance.isLive() &&
          state.duration > 0 &&
          state.currentTime &&
          state.currentTime <= state.duration
        ) {
          navigator.mediaSession.setPositionState({
            duration: state.duration,
            position: state.currentTime,
          });
        }
      });
    }
  }
}
