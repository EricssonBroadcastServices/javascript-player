// SPDX-FileCopyrightText: 2024 Red Bee Media Ltd <https://www.redbeemedia.com/>
//
// SPDX-License-Identifier: MIT

import PlayIcon from "mdi-preact/PlayIcon";
import { h } from "preact";
import { memo } from "preact/compat";

import { useTogglePlayPause } from "../../../hooks/useController";
import style from "./bigPlay.module.scss";

type BigPlayButtonProps = {
  poster?: string;
};

function BigPlayButton({ poster }: BigPlayButtonProps) {
  const togglePlayPause = useTogglePlayPause();
  return (
    <div
      class={style.container}
      style={
        poster && {
          backgroundColor: "#000",
          backgroundImage: `url("${poster}")`,
          backgroundSize: "contain",
          backgroundPosition: "50% 50%",
        }
      }
      onClick={togglePlayPause}
    >
      <PlayIcon />
    </div>
  );
}

export default memo(BigPlayButton);
