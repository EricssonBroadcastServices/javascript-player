// SPDX-FileCopyrightText: 2024 Red Bee Media Ltd <https://www.redbeemedia.com/>
//
// SPDX-License-Identifier: MIT

import { useEffect, useState } from "preact/hooks";

import type { CastSender } from "@ericssonbroadcastservices/js-player-cast-sender";
import type { PlayerCore } from "@ericssonbroadcastservices/js-player-core";
import {
  BasePlayerState,
  CastSenderEvent,
  PlaybackState,
  PlayerEvents,
} from "@ericssonbroadcastservices/js-player-shared";

export function useHasError(playerCore?: PlayerCore, castSender?: CastSender) {
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    const onStateChange = ({ playbackState }: BasePlayerState) => {
      setHasError(playbackState === PlaybackState.ERROR);
    };
    if (playerCore) {
      playerCore.on(PlayerEvents.STATE_CHANGED, onStateChange);
      return () => playerCore.off(PlayerEvents.STATE_CHANGED, onStateChange);
    } else if (castSender) {
      castSender.on(CastSenderEvent.STATE_CHANGE, onStateChange);
      return () => {
        castSender.off(CastSenderEvent.STATE_CHANGE, onStateChange);
      };
    }
  }, [playerCore, castSender]);

  return hasError;
}
