// SPDX-FileCopyrightText: 2024 Red Bee Media Ltd <https://www.redbeemedia.com/>
//
// SPDX-License-Identifier: MIT

import "@ericssonbroadcastservices/javascript-player/dist/style.css";

import { RedBeePlayer } from "@ericssonbroadcastservices/javascript-player";
import { getUUID } from "@ericssonbroadcastservices/js-player-shared";

import {
  fetchAssetPageDetails,
  observableAttributes,
  parseOptions,
  stringToBoolean,
} from "./utils";

export const RedBeePlayerComponentEvents = {
  LOADED: "loaded",
} as const;

class RedBeePlayerComponent extends HTMLElement {
  private player?: RedBeePlayer;
  private wrapperElement: HTMLDivElement;

  constructor() {
    super();
    this.wrapperElement = document.createElement("div");
    this.wrapperElement.id = `player_${getUUID()}`;
  }

  static get observedAttributes() {
    return observableAttributes;
  }

  async connectedCallback() {
    this.setupStyle();
    this.setupPlayer();
  }

  setupStyle() {
    this.appendChild(this.wrapperElement);
  }

  async setupPlayer() {
    try {
      // since the player need a wrapper selector to render within, we send in our generated wrapper element
      const assetPage = this.getAttribute("assetpage");
      const poster = this.getAttribute("poster");
      const startTime = this.getAttribute("starttime");
      const audioOnly = Boolean(this.getAttribute("audioonly"));
      let source = this.getAttribute("assetid") || this.getAttribute("source");
      const { player, analytics, skin } = parseOptions(this.attributes);

      if (assetPage) {
        const { assetId, ...options } = await fetchAssetPageDetails(assetPage);
        source = assetId;
        Object.assign(player, options);
      }

      if (
        player.customer &&
        player.businessUnit &&
        player.exposureBaseUrl &&
        source
      ) {
        const playerInstance = new RedBeePlayer({
          player: {
            ...player,
            // reassign non-optional props outside of player namespace to force TS
            // to infer them by value instead of the player type:
            customer: player.customer,
            businessUnit: player.businessUnit,
            exposureBaseUrl: player.exposureBaseUrl,
            wrapperElement: this.wrapperElement,
          },
          analytics,
          skin,
        });
        playerInstance.load({
          source,
          audioOnly,
          ...(startTime && { startTime: Number(startTime) }),
          ...(poster && { poster }),
        });
        this.player = playerInstance;
        this.setupEventProxy();
        this.dispatchEvent(
          new CustomEvent(RedBeePlayerComponentEvents.LOADED, {
            detail: { playerInstance: this.player },
          })
        );
      } else {
        console.error(
          'Missing web-component attributes: Either "assetpage" or "customer", "businessunit", "exposurebaseurl" and "assetid" are required.'
        );
      }
    } catch (e) {
      console.error(e);
    }
  }

  setupEventProxy() {
    if (!this.player) return;
    this.player.onAll(({ event, data }) => {
      this.dispatchEvent(new CustomEvent(event, { detail: data }));
    });
  }

  async restartPlayer() {
    if (this.player) {
      this.player.destroy();
    }
    this.setupPlayer();
  }

  attributeChangedCallback(name: string, oldValue: string, value: string) {
    // Only handle changes, not initial attribute setup
    if (this.player) {
      if (name === "muted") {
        const boolValue = stringToBoolean(value);
        if (boolValue === undefined) {
          console.warn(
            `Ignoring invalid value "${value}" for boolean attribute "muted". Expected "true" or "false"`
          );
        } else {
          this.player.setMuted(boolValue);
        }
      } else if (name === "starttime") {
        this.player.seekTo({ time: parseFloat(value) });
      } else if (name !== "autoplay") {
        this.restartPlayer();
      }
    }
  }

  disconnectedCallback() {
    if (this.player) {
      this.player.destroy();
    }
  }
}
customElements.define("redbee-player", RedBeePlayerComponent);
