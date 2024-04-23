// SPDX-FileCopyrightText: 2024 Red Bee Media Ltd <https://www.redbeemedia.com/>
//
// SPDX-License-Identifier: MIT

import { h } from "preact";
import { memo } from "preact/compat";

import { QuickSeekTime } from "@ericssonbroadcastservices/js-player-shared";

import { useController } from "../../hooks/useController";
import useDoubleTap from "../../hooks/useDoubleTap";
import style from "./gestures.module.scss";

type GesturesProps = {
  onSingleTap: () => void;
  isSkinHidden?: boolean;
  pointer?: boolean;
};

function Gestures({
  onSingleTap,
  isSkinHidden,
  pointer = false,
}: GesturesProps) {
  const controller = useController();

  const seekForward = useDoubleTap({
    doubleTap: () => controller?.scrub(QuickSeekTime),
    singleTap: onSingleTap,
  });
  const seekRewind = useDoubleTap({
    doubleTap: () => controller?.scrub(-QuickSeekTime),
    singleTap: onSingleTap,
  });

  const styling: h.JSX.CSSProperties = {
    ...(pointer && { cursor: "pointer" }),
    ...(isSkinHidden && { zIndex: 99 }),
  };

  return (
    <div
      class={style.container}
      onTouchStart={(evt: TouchEvent) => evt.preventDefault()}
      onTouchMove={(evt: TouchEvent) => evt.preventDefault()}
      onClick={(evt: MouseEvent) => evt.preventDefault()}
      style={styling}
    >
      <div
        class={style.touchLeft}
        onTouchStart={seekRewind}
        onClick={seekRewind}
      />
      <div
        class={style.touchRight}
        onTouchStart={seekForward}
        onClick={seekForward}
      />
    </div>
  );
}

export default memo(Gestures);
