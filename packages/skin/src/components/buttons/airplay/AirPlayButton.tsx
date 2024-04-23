// SPDX-FileCopyrightText: 2024 Red Bee Media Ltd <https://www.redbeemedia.com/>
//
// SPDX-License-Identifier: MIT

import AppleAirplayIcon from "mdi-preact/AppleAirplayIcon";
import { h } from "preact";
import { memo } from "preact/compat";

import { usePlayerCore } from "../../../hooks/useController";
import style from "./airplay.module.css";

function AirPlayButton() {
  const playerCore = usePlayerCore();
  return (
    <div class={style.container} onClick={() => playerCore?.toggleAirPlay()}>
      <AppleAirplayIcon />
    </div>
  );
}

export default memo(AirPlayButton);
