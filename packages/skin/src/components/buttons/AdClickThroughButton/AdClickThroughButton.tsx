// SPDX-FileCopyrightText: 2024 Red Bee Media Ltd <https://www.redbeemedia.com/>
//
// SPDX-License-Identifier: MIT

import classNames from "classnames";
import LinkVariantIcon from "mdi-preact/LinkVariantIcon";
import { h } from "preact";
import { useCallback } from "preact/hooks";

import style from "./adClickThroughButton.module.scss";

interface IAdClickThroughButton {
  isMobile: boolean;
  onClickThrough: () => void;
  clickThroughUrl?: string;
  clickTrackingUrls?: string[];
  translations?: any;
}

export function AdClickThroughButton({
  isMobile,
  onClickThrough,
  clickThroughUrl,
  translations,
}: IAdClickThroughButton) {
  const onClickHandler = useCallback(() => {
    onClickThrough?.();
  }, [onClickThrough]);
  const hasLinkTranslation = !!translations?.AD_CLICK_THROUGH_TEXT;

  return (
    <div
      class={classNames(style.container, {
        [style.hidden]: !clickThroughUrl,
        [style.isMobile]: isMobile,
      })}
      onClick={onClickHandler}
    >
      <div class={style.clickthroughButton}>
        {!hasLinkTranslation && <LinkVariantIcon />}
        {hasLinkTranslation && translations?.AD_CLICK_THROUGH_TEXT}
      </div>
    </div>
  );
}
