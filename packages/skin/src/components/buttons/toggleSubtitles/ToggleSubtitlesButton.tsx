// SPDX-FileCopyrightText: 2024 Red Bee Media Ltd <https://www.redbeemedia.com/>
//
// SPDX-License-Identifier: MIT

import SubtitlesIcon from "mdi-preact/SubtitlesOutlineIcon";
import { h } from "preact";
import { memo } from "preact/compat";

import { useController } from "../../../hooks/useController";
import style from "./toggle-subtitles.module.css";

interface ISubtitleButton {
  isEnabled: boolean;
}

function ToggleSubtitlesButton({ isEnabled }: ISubtitleButton) {
  const controller = useController();
  const onClick = () => {
    if (!controller || controller.getSubtitleTracks()?.length === 0) {
      return;
    }
    const tracks = controller.getSubtitleTracks();
    const track = controller.getSubtitleTrack();
    controller.setSubtitleTrack(track ? undefined : tracks[0]);
  };
  return (
    <div class={style.buttonContainer} onClick={onClick}>
      {isEnabled ? (
        <SubtitlesIcon color={"rgba(255, 255, 255, 1"} />
      ) : (
        <SubtitlesIcon color={"rgba(255, 255, 255, 0.5"} />
      )}
    </div>
  );
}

export default memo(ToggleSubtitlesButton);
