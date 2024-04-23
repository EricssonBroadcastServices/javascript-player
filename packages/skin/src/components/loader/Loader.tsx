// SPDX-FileCopyrightText: 2024 Red Bee Media Ltd <https://www.redbeemedia.com/>
//
// SPDX-License-Identifier: MIT

import { h } from "preact";

import style from "./loader.module.css";

export default function Loader() {
  return (
    <div class={style.container}>
      <span class={style.loader} />
    </div>
  );
}
