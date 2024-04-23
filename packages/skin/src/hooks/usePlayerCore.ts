// SPDX-FileCopyrightText: 2024 Red Bee Media Ltd <https://www.redbeemedia.com/>
//
// SPDX-License-Identifier: MIT

import { MarkerPoint } from "@ericssonbroadcastservices/rbm-ott-sdk";
import { useEffect, useState } from "preact/hooks";

import type { PlayerCore } from "@ericssonbroadcastservices/js-player-core";
import {
  CorePlayerState,
  DefaultPlayerState,
  PlayerEvents,
} from "@ericssonbroadcastservices/js-player-shared";

import { IAssetMetadata, metadataFromAsset } from "../utils/metadata";

export type PlayerCoreMetadata = {
  asset?: IAssetMetadata;
  timelineSpriteCues: any[];
  activeIntro?: MarkerPoint;
};

export function usePlayerCoreState(
  playerCore?: PlayerCore,
  locale?: string
): [CorePlayerState, PlayerCoreMetadata] {
  const [state, setState] = useState<CorePlayerState>({
    ...DefaultPlayerState,
    isAirPlaying: false,
    isAirPlayAvailable: false,
    contractRestrictions: undefined,
  });

  const [metadata, setMetadata] = useState<PlayerCoreMetadata>({
    asset: undefined,
    timelineSpriteCues: [],
    activeIntro: undefined,
  });

  useEffect(() => {
    playerCore?.on(PlayerEvents.STATE_CHANGED, (state) => {
      setState((prevState) => {
        return {
          ...prevState,
          ...state,
        };
      });
    });
    playerCore?.on(PlayerEvents.LOADED, () => {
      if (!playerCore?.getAssetInfo()) return;
      setMetadata((prevState) => {
        const asset = playerCore?.getAssetInfo();
        return {
          ...prevState,
          asset:
            asset &&
            metadataFromAsset(
              asset,
              playerCore?.getProgramInfo()?.current,
              locale
            ),
        };
      });
      playerCore?.getTimelineSpriteCues().then((timelineSpriteCues) => {
        setMetadata((prevState) => {
          return {
            ...prevState,
            timelineSpriteCues,
          };
        });
      });
    });
    playerCore?.on(PlayerEvents.PROGRAM_CHANGED, ({ channel, program }) => {
      setMetadata((prevState) => {
        return {
          ...prevState,
          asset: metadataFromAsset(channel, program, locale),
        };
      });
    });

    playerCore?.on(PlayerEvents.INTRO_START, ({ contentMarker }) => {
      setMetadata((prevState) => {
        return {
          ...prevState,
          activeIntro: contentMarker,
        };
      });
    });

    playerCore?.on(PlayerEvents.INTRO_END, ({ contentMarker }) => {
      setMetadata((prevState) => {
        return {
          ...prevState,
          activeIntro:
            contentMarker.offset === prevState.activeIntro?.offset
              ? undefined
              : prevState.activeIntro,
        };
      });
    });
  }, [playerCore, locale]);

  useEffect(() => {
    let onResize: () => void;
    let timeout: number;
    window.addEventListener(
      "resize",
      (onResize = () => {
        clearTimeout(timeout);
        timeout = window.setTimeout(() => {
          playerCore?.getTimelineSpriteCues().then((timelineSpriteCues) => {
            setState((prevState) => {
              return {
                ...prevState,
                timelineSpriteCues,
              };
            });
          });
        }, 500);
      })
    );
    return () => window.removeEventListener("resize", onResize);
  }, []);

  return [state, metadata];
}
