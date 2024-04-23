// SPDX-FileCopyrightText: 2024 Red Bee Media Ltd <https://www.redbeemedia.com/>
//
// SPDX-License-Identifier: MIT

import FullscreenExitIcon from "mdi-preact/FullscreenExitIcon";
import FullscreenIcon from "mdi-preact/FullscreenIcon";
import { h } from "preact";
import { memo } from "preact/compat";

import { usePlayerCore } from "../../../hooks/useController";
import style from "./fullscreen.module.css";

type FullcreenButtonProps = {
  isFullscreen: boolean;
};

function FullcreenButton({ isFullscreen }: FullcreenButtonProps) {
  const playerCore = usePlayerCore();
  return (
    <div class={style.container} onClick={() => playerCore?.toggleFullscreen()}>
      {isFullscreen ? <FullscreenExitIcon /> : <FullscreenIcon />}
    </div>
  );
}

export default memo(FullcreenButton);
