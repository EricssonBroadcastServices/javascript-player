// SPDX-FileCopyrightText: 2024 Red Bee Media Ltd <https://www.redbeemedia.com/>
//
// SPDX-License-Identifier: MIT

import PictureInPictureIcon from "mdi-preact/PictureInPictureTopRightIcon";
import { h } from "preact";
import { memo } from "preact/compat";

import { usePlayerCore } from "../../../hooks/useController";
import style from "./pip.module.css";

function PictureInPictureButton() {
  const playerCore = usePlayerCore();
  return (
    <div
      class={style.container}
      onClick={() => playerCore?.togglePictureInPicture()}
    >
      <PictureInPictureIcon />
    </div>
  );
}

export default memo(PictureInPictureButton);
