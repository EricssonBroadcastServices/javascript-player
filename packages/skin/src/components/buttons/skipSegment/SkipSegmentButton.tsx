// SPDX-FileCopyrightText: 2024 Red Bee Media Ltd <https://www.redbeemedia.com/>
//
// SPDX-License-Identifier: MIT

import classNames from "classnames";
import SkipNextIcon from "mdi-preact/SkipNextIcon";
import { h } from "preact";
import { useCallback, useEffect, useState } from "preact/hooks";

import { PlayerCore } from "@ericssonbroadcastservices/js-player-core";
import { getLocalizedTitle } from "@ericssonbroadcastservices/js-player-shared";

import { usePlayerCoreState } from "../../../hooks/usePlayerCore";
import style from "./skipSegmentButton.module.scss";

interface ISkipSegmentButton {
  playerCore?: PlayerCore;
  isMobile: boolean;
  showSkipOption: boolean;
  locale: string;
}

export function SkipSegmentButton({
  playerCore,
  showSkipOption,
  locale,
  isMobile,
}: ISkipSegmentButton) {
  const [{ currentTime }, { activeIntro }] = usePlayerCoreState(
    playerCore,
    locale
  );
  const [visible, setVisible] = useState(false);
  const [animateOut, setAnimateOut] = useState(false);

  const condition = activeIntro && showSkipOption;

  useEffect(() => {
    if (condition && !visible) {
      setVisible(true);
    } else if (!condition && visible) {
      setAnimateOut(true);
      setTimeout(() => {
        setVisible(false);
        setAnimateOut(false);
      }, 500);
    }
  }, [currentTime]);

  const onClickHandler = useCallback(() => {
    if (activeIntro?.endOffset) {
      playerCore?.seekTo(activeIntro.endOffset / 1000);
    }
  }, [playerCore, activeIntro]);

  return (
    <div
      class={classNames(style.container, {
        [style.skipButtonExit]: animateOut,
        [style.hidden]: !visible,
        [style.isMobile]: isMobile,
      })}
      onClick={onClickHandler}
    >
      <div class={style.skipButton}>
        <SkipNextIcon />
        <div class={style.title}>
          {getLocalizedTitle(activeIntro?.localized ?? [], locale)}
        </div>
      </div>
    </div>
  );
}
