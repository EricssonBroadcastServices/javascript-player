// SPDX-FileCopyrightText: 2024 Red Bee Media Ltd <https://www.redbeemedia.com/>
//
// SPDX-License-Identifier: MIT

import CastIcon from "mdi-preact/CastIcon";
import { h } from "preact";
import { memo } from "preact/compat";

import style from "./castBackground.module.scss";

type CastBackgroundProps = {
  title?: string;
  image?: string;
};

function CastBackground({ title, image }: CastBackgroundProps) {
  return (
    <div class={style.container}>
      <span class={style.title}>{title}</span>
      {image && <img class={style.image} src={image} alt="" />}
      {!image && <CastIcon />}
    </div>
  );
}

export default memo(CastBackground);
