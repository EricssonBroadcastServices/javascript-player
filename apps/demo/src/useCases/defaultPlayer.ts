// SPDX-FileCopyrightText: 2024 Red Bee Media Ltd <https://www.redbeemedia.com/>
//
// SPDX-License-Identifier: MIT

import {
  IRedBeePlayerOptions,
  RedBeePlayer,
} from "@ericssonbroadcastservices/javascript-player";
import { OverlayWidgetManager } from "@ericssonbroadcastservices/js-player-overlays";
import { PlayerEvents } from "@ericssonbroadcastservices/js-player-shared";

import { getLoadOptions, isSubscribedEvent, updateLogs } from "..";

const url = new URL(location.href);

async function getTranslations(exposureBaseUrl: string, locale: string) {
  try {
    const url = `${exposureBaseUrl}/api/internal/translations/${locale}`;
    const response = await fetch(url);
    if (response.ok) {
      return await response.json();
    }
  } catch (err) {}
}

export async function defaultPlayer(
  source: string,
  options: IRedBeePlayerOptions,
  onLoad?: (player: RedBeePlayer) => void
): Promise<() => void> {
  options.locale = url.searchParams.get("locale") ?? undefined;
  const skinTranslations = await getTranslations(
    options.exposureBaseUrl,
    options.locale || "en"
  );
  const debugInformation = document.querySelector("#debug-information");
  const player = new RedBeePlayer({
    player: options,
    skin: { translations: skinTranslations },
  });
  // Assign to window (for debugging in the console)
  Object.assign(window, { player });

  // setup eventStorage for E2E tests
  const eventStorage: { event: string; data: any }[] = ((
    window as any
  ).eventStorage = []);
  player.onAll(({ event, data }) => {
    eventStorage.push({ event, data });
  });

  let overlayManager: OverlayWidgetManager | undefined;

  const cleanup = () => {
    player.destroy();
    overlayManager?.destroy();
  };

  try {
    const start = Date.now();
    player.onAll(({ event, data }) => {
      let logSeverity: "info" | "error" | "warn" = "info";
      if (event === PlayerEvents.ERROR) logSeverity = "error";
      if (event === PlayerEvents.DROPPED_FRAMES) logSeverity = "warn";
      if (event === PlayerEvents.STATE_CHANGED) {
        try {
          if (!debugInformation) {
            return;
          }
          debugInformation.textContent = JSON.stringify(
            data,
            (key, value) => {
              // filter out keys causing circular dependency errors when using hls.js
              if (key === "raw") {
                return undefined;
              }
              return value;
            },
            2
          );
        } catch (e) {
          // no-op
        }
      } else if (isSubscribedEvent(event)) {
        updateLogs(event, data, start, logSeverity);
      }
    });
    player.once(PlayerEvents.LOADED, () => {
      if (!source.includes("://")) {
        const url = player.getAssetInfo()?.overlayWidgets?.[0]?.url;
        const wrapperElement = player.getContainerElement();
        if (url && wrapperElement) {
          overlayManager = new OverlayWidgetManager({ wrapperElement });
          overlayManager.addWidget({ url });
        }
      }
      onLoad?.(player);
    });
    player.load(getLoadOptions());
  } catch (e) {
    console.error(e);
    cleanup();
    throw e;
  }

  return cleanup;
}
