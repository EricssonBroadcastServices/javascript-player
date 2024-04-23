// SPDX-FileCopyrightText: 2024 Red Bee Media Ltd <https://www.redbeemedia.com/>
//
// SPDX-License-Identifier: MIT

import Rewind10Icon from "mdi-preact/Rewind10Icon";
import { h } from "preact";
import { memo } from "preact/compat";

import { QuickSeekTime } from "@ericssonbroadcastservices/js-player-shared";

import { useController } from "../../../hooks/useController";
import style from "./jump.module.css";

function JumpBackButton() {
  const controller = useController();
  return (
    <div
      class={style.container}
      onClick={() => controller?.scrub(-QuickSeekTime)}
    >
      <Rewind10Icon />
    </div>
  );
}

export default memo(JumpBackButton);
