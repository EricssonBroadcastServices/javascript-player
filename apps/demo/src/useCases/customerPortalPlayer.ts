// SPDX-FileCopyrightText: 2024 Red Bee Media Ltd <https://www.redbeemedia.com/>
//
// SPDX-License-Identifier: MIT

import {
  IPlayerCoreOptions,
  PlayerCore,
} from "@ericssonbroadcastservices/js-player-core";
import { PlayerEvents } from "@ericssonbroadcastservices/js-player-shared";
import { RedBeeSkin } from "@ericssonbroadcastservices/js-player-skin";

// The purpose of this player is to verify customer portal player continues to work with formats
// instead of cu, bu, baseurl and session token. The customer portal fetches formats from the
// play request on the back-end instead.

export async function customerPortalPlayer(
  source: string,
  options: IPlayerCoreOptions,
  onLoad?: (player: PlayerCore) => void
): Promise<() => void> {
  const {
    customer,
    businessUnit,
    exposureBaseUrl,
    sessionToken,
    autoplay,
    castAppId,
    logLevel,
    wrapperElement,
  } = options;
  try {
    if (source.includes("://")) {
      throw new Error("CustomerPortalPlayer plays asset ids only. Not URLs");
    }
    const playResponseUrl = `${exposureBaseUrl}/v2/customer/${customer}/businessunit/${businessUnit}/entitlement/${source}/play`;
    const playResponse = await fetch(playResponseUrl, {
      method: "GET",
      headers: {
        authorization: `Bearer ${sessionToken}`,
      },
    });
    if (!playResponse.ok) throw new Error("Error in playresponse");
    const { formats } = await playResponse.json();

    const player = new PlayerCore({
      autoplay,
      castAppId,
      logLevel,
      wrapperElement,
    });
    const skin = new RedBeeSkin(wrapperElement);
    // Assign to window (for debugging in the console)
    Object.assign(window, { player });
    // ensure .core and .skin is consistent with default player
    Object.assign(player, { skin, core: player });
    skin.render(player);
    player.once(PlayerEvents.LOADED, () => onLoad?.(player));
    player.on(PlayerEvents.ERROR, (data) => {
      console.error("[DEMO] customerPortalPlayer error", data);
    });
    player.loadFromFormats(formats);
    return () => {
      player.destroy();
      skin.destroy();
    };
  } catch (error) {
    console.error(error);
    throw error;
  }
}
