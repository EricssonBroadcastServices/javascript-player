// SPDX-FileCopyrightText: 2024 Red Bee Media Ltd <https://www.redbeemedia.com/>
//
// SPDX-License-Identifier: MIT

import classNames from "classnames";
import PauseIcon from "mdi-preact/PauseIcon";
import PlayIcon from "mdi-preact/PlayIcon";
import StopIcon from "mdi-preact/StopIcon";
import { h } from "preact";
import { memo } from "preact/compat";

import { PlaybackState } from "@ericssonbroadcastservices/js-player-shared";

import { useTogglePlayPause } from "../../../hooks/useController";
import style from "./playPauseStop.module.scss";

function PlayPauseStopButton({
  state,
  pausable = true,
  className,
}: {
  state: PlaybackState;
  pausable: boolean;
  className?: string;
}) {
  const togglePlayPause = useTogglePlayPause();
  const stopPauseIcon = pausable ? <PauseIcon /> : <StopIcon />;
  return (
    <div
      class={classNames(style.container, className)}
      onClick={togglePlayPause}
    >
      {state !== PlaybackState.PLAYING ? <PlayIcon /> : stopPauseIcon}
    </div>
  );
}

export default memo(PlayPauseStopButton);
