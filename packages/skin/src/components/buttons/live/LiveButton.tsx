// SPDX-FileCopyrightText: 2024 Red Bee Media Ltd <https://www.redbeemedia.com/>
//
// SPDX-License-Identifier: MIT

import classNames from "classnames";
import { h } from "preact";
import { memo } from "preact/compat";

import { useController } from "../../../hooks/useController";
import style from "./liveButton.module.scss";

interface ILiveButton {
  isAtLiveEdge: boolean;
}

function LiveButton({ isAtLiveEdge }: ILiveButton) {
  const controller = useController();
  return (
    <span
      onClick={() => controller?.seekToLive()}
      class={classNames(style.container, {
        [style.dvr]: !isAtLiveEdge,
      })}
    >
      LIVE
    </span>
  );
}

export default memo(LiveButton);
