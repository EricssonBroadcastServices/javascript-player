// SPDX-FileCopyrightText: 2024 Red Bee Media Ltd <https://www.redbeemedia.com/>
//
// SPDX-License-Identifier: MIT

import classNames from "classnames";
import { h } from "preact";

import style from "./adIndexLabel.module.scss";

type AdIndexLabelProps = {
  currentAdIndex: number;
  currentAdBreakTotal: number;
  isMobile?: boolean;
  translations?: any;
};

export function AdIndexLabel({
  currentAdIndex,
  currentAdBreakTotal,
  isMobile,
  translations,
}: AdIndexLabelProps) {
  return (
    <div
      class={classNames(style.container, {
        [style.isMobile]: !!isMobile,
      })}
    >
      <div class={style.adIndexLabel}>
        {translations?.AD || "Ad"} {currentAdIndex}/{currentAdBreakTotal}
      </div>
    </div>
  );
}
