// SPDX-FileCopyrightText: 2024 Red Bee Media Ltd <https://www.redbeemedia.com/>
//
// SPDX-License-Identifier: MIT

import ErrorIcon from "mdi-preact/FaceSadIcon";
import { h } from "preact";

import style from "./errorOverlay.module.scss";

export default function ErrorOverlay() {
  return (
    <div class={style.container}>
      <ErrorIcon />
    </div>
  );
}
