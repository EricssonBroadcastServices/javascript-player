// SPDX-FileCopyrightText: 2024 Red Bee Media Ltd <https://www.redbeemedia.com/>
//
// SPDX-License-Identifier: MIT

import { createContext } from "preact";
import { useCallback, useContext } from "preact/hooks";

import type { CastSender } from "@ericssonbroadcastservices/js-player-cast-sender";
import type { PlayerCore } from "@ericssonbroadcastservices/js-player-core";
import { Controller } from "@ericssonbroadcastservices/js-player-shared";

const ControllerContext = createContext<PlayerCore | CastSender | undefined>(
  undefined
);

export const ControllerProvider = ControllerContext.Provider;

export function useController(): Controller | undefined {
  return useContext(ControllerContext);
}

export function usePlayerCore(): PlayerCore | undefined {
  const controller = useContext(ControllerContext);
  if (controller && !("isConnected" in controller)) {
    return controller;
  }
}

export function useTogglePlayPause() {
  const controller = useController();
  return useCallback(() => {
    if (!controller) {
      return;
    }
    if (controller.isPlaying()) {
      controller.pause();
    } else {
      controller.play();
    }
  }, [controller]);
}
