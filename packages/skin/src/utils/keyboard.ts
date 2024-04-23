// SPDX-FileCopyrightText: 2024 Red Bee Media Ltd <https://www.redbeemedia.com/>
//
// SPDX-License-Identifier: MIT

import hotkeys from "hotkeys-js";

import {
  Controller,
  QuickSeekTime,
} from "@ericssonbroadcastservices/js-player-shared";

const KeyboardShortcuts = {
  TOGGLE_PLAY: "space",
  FORWARD: "right",
  BACKWARD: "left",
  VOLUME_UP: "up",
  VOLUME_DOWN: "down",
  TOGGLE_MUTE: "m",
  TOGGLE_FULLSCREEN: "f",
};

const SCOPE = "@redbeemedia/javascript-player-shortcuts";

export function setupKeyboardShortcuts(
  controller: Controller,
  wrapper: HTMLElement
) {
  hotkeys(Object.values(KeyboardShortcuts).join(","), SCOPE, (e, data) => {
    if (
      wrapper !== document.activeElement &&
      !wrapper.contains(document.activeElement)
    ) {
      return;
    }
    switch (data.key) {
      case KeyboardShortcuts.TOGGLE_PLAY:
        e.preventDefault();
        if (controller.isPlaying()) {
          controller.pause();
        } else {
          controller.play();
        }
        break;
      case KeyboardShortcuts.BACKWARD:
        e.preventDefault();
        controller.scrub(-QuickSeekTime);
        break;
      case KeyboardShortcuts.FORWARD:
        e.preventDefault();
        controller.scrub(QuickSeekTime);
        break;
      case KeyboardShortcuts.TOGGLE_MUTE:
        e.preventDefault();
        controller.toggleMuted();
        break;
      case KeyboardShortcuts.TOGGLE_FULLSCREEN:
        e.preventDefault();
        controller.toggleFullscreen?.();
        break;
    }
  });
  hotkeys.setScope(SCOPE);
  return () => {
    hotkeys.deleteScope(SCOPE);
  };
}
