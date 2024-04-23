// SPDX-FileCopyrightText: 2024 Red Bee Media Ltd <https://www.redbeemedia.com/>
//
// SPDX-License-Identifier: MIT

import CogIcon from "mdi-preact/CogIcon";
import { h } from "preact";

import style from "./settings.module.scss";

interface ISettingsButton {
  toggleMenu: () => void;
}

export default function SettingsButton({ toggleMenu }: ISettingsButton) {
  return (
    <div>
      <div class={style.buttonContainer} onClick={toggleMenu}>
        <CogIcon />
      </div>
    </div>
  );
}
