// SPDX-FileCopyrightText: 2024 Red Bee Media Ltd <https://www.redbeemedia.com/>
//
// SPDX-License-Identifier: MIT

import FormatListBulletedIcon from "mdi-preact/FormatListBulletedIcon";
import { h } from "preact";

import style from "./contentMarkersButton.module.scss";

interface IContentMarkersButton {
  toggleMenu: () => void;
}

export default function ContentMarkersButton({
  toggleMenu,
}: IContentMarkersButton) {
  return (
    <div>
      <div class={style.buttonContainer} onClick={toggleMenu}>
        <FormatListBulletedIcon />
      </div>
    </div>
  );
}
