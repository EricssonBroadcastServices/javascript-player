// SPDX-FileCopyrightText: 2024 Red Bee Media Ltd <https://www.redbeemedia.com/>
//
// SPDX-License-Identifier: MIT

import { h, render } from "preact";

import { CastSender } from "@ericssonbroadcastservices/js-player-cast-sender";
import { PlayerCore } from "@ericssonbroadcastservices/js-player-core";

import style from "./index.module.scss";
import { IPlayerSkinOptions, ISkinOptions, defaultOptions } from "./options";
import PlayerSkin, { IPlayerSkinEvents } from "./PlayerSkin";
import { setupKeyboardShortcuts } from "./utils/keyboard";

export { PlayerSkin };
export type { IPlayerSkinEvents, IPlayerSkinOptions };

export class RedBeeSkin {
  private skinContainer: HTMLElement;
  private cleanupKeyboardShortcuts?: () => void;
  private options: ISkinOptions;

  constructor(
    wrapperElement: HTMLElement,
    options?: IPlayerSkinOptions,
    private events?: IPlayerSkinEvents
  ) {
    this.options = {
      ...defaultOptions,
      ...options,
    };
    this.skinContainer = document.createElement("div");
    this.skinContainer.classList.add(
      "redbee-player-skin-container",
      style.skinWrapper
    );

    wrapperElement.appendChild(this.skinContainer);
    Object.assign(wrapperElement.style, {
      position: "relative",
      overflow: "visible", // hacky solution due to bug on safari
    });
  }

  render(playerCore?: PlayerCore, castSender?: CastSender) {
    const controller = playerCore || castSender;
    if (!controller) {
      return render(null, this.skinContainer);
    }
    if (this.options.keyboardShortcuts) {
      this.cleanupKeyboardShortcuts = setupKeyboardShortcuts(
        controller,
        this.skinContainer
      );
    }
    render(
      <PlayerSkin
        playerCore={playerCore}
        castSender={castSender}
        options={this.options}
        onSkinHidden={this.events?.onSkinHidden}
        onSkinVisible={this.events?.onSkinVisible}
      />,
      this.skinContainer
    );
  }

  public destroy() {
    this.cleanupKeyboardShortcuts?.();
    render(null, this.skinContainer);
    this.skinContainer.remove();
  }
}
