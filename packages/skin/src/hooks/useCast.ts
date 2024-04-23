// SPDX-FileCopyrightText: 2024 Red Bee Media Ltd <https://www.redbeemedia.com/>
//
// SPDX-License-Identifier: MIT

import { useEffect, useState } from "preact/hooks";

import { CastSender } from "@ericssonbroadcastservices/js-player-cast-sender";
import {
  BasePlayerState,
  CastSenderEvent,
  DefaultPlayerState,
} from "@ericssonbroadcastservices/js-player-shared";

type CastSenderMetadata = {
  title?: string;
  imageUrl?: string;
};

export function useCastSenderState(
  castSender?: CastSender,
  locale?: string
): [BasePlayerState, CastSenderMetadata] {
  const [state, setState] = useState<BasePlayerState>(DefaultPlayerState);

  const [metadata, setMetadata] = useState<CastSenderMetadata>({
    title: undefined,
    imageUrl: undefined,
  });

  useEffect(() => {
    const onStateChange = (state: BasePlayerState) => {
      setState((prevState) => {
        return {
          ...prevState,
          ...state,
        };
      });
    };
    const onMetadataUpdate = (metadata: {
      title?: string;
      imageUrl?: string;
    }) => {
      setMetadata((prevMetadata) => ({
        ...prevMetadata,
        ...metadata,
      }));
    };
    castSender?.on(CastSenderEvent.STATE_CHANGE, onStateChange);
    castSender?.on(CastSenderEvent.METADATA_UPDATE, onMetadataUpdate);
    return () => {
      castSender?.off(CastSenderEvent.STATE_CHANGE, onStateChange);
      castSender?.off(CastSenderEvent.METADATA_UPDATE, onMetadataUpdate);
    };
  }, [castSender, locale]);

  return [state, metadata];
}

export function useIsCastAvailable(castSender?: CastSender) {
  const [isCastAvailable, setIsCastAvailable] = useState(false);

  useEffect(() => {
    if (castSender) {
      const onAvailabilityChanged = ({ available }: { available: boolean }) => {
        setIsCastAvailable(available);
      };
      castSender.on(
        CastSenderEvent.AVAILABILITY_CHANGED,
        onAvailabilityChanged
      );
      return () =>
        castSender.off(
          CastSenderEvent.AVAILABILITY_CHANGED,
          onAvailabilityChanged
        );
    }
  }, [castSender]);

  return isCastAvailable;
}
