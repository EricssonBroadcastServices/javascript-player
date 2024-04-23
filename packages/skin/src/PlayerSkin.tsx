// SPDX-FileCopyrightText: 2024 Red Bee Media Ltd <https://www.redbeemedia.com/>
//
// SPDX-License-Identifier: MIT

import classNames from "classnames";
import { h } from "preact";
import { useRef } from "preact/hooks";

import type { CastSender } from "@ericssonbroadcastservices/js-player-cast-sender";
import type { PlayerCore } from "@ericssonbroadcastservices/js-player-core";

import { SkipSegmentButton } from "./components/buttons/skipSegment/SkipSegmentButton";
import ErrorOverlay from "./components/errorOverlay/ErrorOverlay";
import Loader from "./components/loader/Loader";
import CastSkin from "./components/skins/castSkin/CastSkin";
import FullSkin, { ISkin } from "./components/skins/fullSkin/FullSkin";
import MobileSkin from "./components/skins/mobileSkin/MobileSkin";
import { useUserActive } from "./components/skins/useUserActive";
import { useIsCastAvailable } from "./hooks/useCast";
import { ControllerProvider } from "./hooks/useController";
import { useHasError } from "./hooks/useHasError";
import { useIsLoading } from "./hooks/useIsLoading";
import { ISkinOptions } from "./options";
import style from "./skin.module.scss";
import { isMobileOS } from "./utils/device";

export interface IPlayerSkinEvents {
  onSkinHidden?: () => void;
  onSkinVisible?: () => void;
}

interface IPlayerSkin {
  playerCore?: PlayerCore;
  castSender?: CastSender;
  options: ISkinOptions;
}

export default function PlayerSkin({
  playerCore,
  castSender,
  options,
  onSkinHidden,
  onSkinVisible,
}: IPlayerSkin & IPlayerSkinEvents) {
  const { locale = "en" } = options;

  const skinContainerRef = useRef<HTMLDivElement | null>(null);

  const isMobile = !!(
    skinContainerRef.current &&
    skinContainerRef.current.offsetHeight <= 640 &&
    isMobileOS()
  );
  const SkinVariant: (props: ISkin & IPlayerSkinEvents) => h.JSX.Element =
    isMobile ? MobileSkin : FullSkin;

  const isLoading = useIsLoading(playerCore, castSender);
  const isCastAvailable = useIsCastAvailable(castSender);
  const hasError = useHasError(playerCore, castSender);

  const [showSkipOption, toggleSkipOption] = useUserActive({
    userActiveTimeout: (options.hideControlsTimer ?? 2800) * 2.5,
  });

  if (hasError) {
    return <ErrorOverlay />;
  }

  return (
    <div
      ref={skinContainerRef}
      tabIndex={0}
      class={classNames(style.container)}
      onMouseMove={toggleSkipOption}
    >
      <SkipSegmentButton
        playerCore={playerCore}
        isMobile={isMobile}
        showSkipOption={showSkipOption}
        locale={locale}
      />
      <ControllerProvider value={playerCore || castSender}>
        {playerCore && (
          <SkinVariant
            playerCore={playerCore}
            options={options}
            locale={locale}
            isCastAvailable={isCastAvailable}
            onSkinHidden={onSkinHidden}
            onSkinVisible={onSkinVisible}
          />
        )}
        {!playerCore && castSender && (
          <CastSkin castSender={castSender} options={options} locale={locale} />
        )}
      </ControllerProvider>
      <div class={style.mediaOverlay}>{isLoading && <Loader />}</div>
    </div>
  );
}
