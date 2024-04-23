// SPDX-FileCopyrightText: 2024 Red Bee Media Ltd <https://www.redbeemedia.com/>
//
// SPDX-License-Identifier: MIT

import { h } from "preact";
import { useCallback, useLayoutEffect, useRef, useState } from "preact/hooks";

import style from "./slider.module.scss";

interface ISlider {
  value: number;
  hoverIndicator?: (percentage: number) => h.JSX.Element;
  onSelect: (percentage: number) => void;
  adMarkerPositions?: number[];
}

interface ExtendedHTMLDivElement extends HTMLDivElement {
  __RBM_CLIENT_RECT: DOMRect | null;
}

/**
 * Clear the DOMRect cache of an element
 * @param  {HTMLDivElement}
 */
function clearBoundingClientRectCache(element: HTMLElement) {
  (element as ExtendedHTMLDivElement).__RBM_CLIENT_RECT = null;
}

/**
 * Get DOMRect of an element, if cached will return cached DOMRect
 * the cache is cleared using clearBoundingClientRectCache()
 * @param  {HTMLDivElement} element
 * @return {DOMRect}
 */
function getBoundingClientRect(element: HTMLDivElement): DOMRect {
  return (
    (element as ExtendedHTMLDivElement).__RBM_CLIENT_RECT ||
    ((element as ExtendedHTMLDivElement).__RBM_CLIENT_RECT =
      element.getBoundingClientRect())
  );
}

/**
 * Get position in percentage of x in width with a maximum of two decimals
 * @param  {number} x
 * @param  {number} width
 * @return {number}
 */
function getPercentage(x: number, width: number): number {
  return parseFloat(((x / width) * 100).toFixed(2));
}

/**
 * Get the x position of the touch in percentage based on the width of the currentTarget
 * @param  {TouchEvent} evt
 * @return {number}
 */
function getTouchPercentage(evt: TouchEvent): number {
  const touch = evt.changedTouches[0];
  const target: HTMLDivElement = evt.currentTarget as HTMLDivElement;

  const offsetX = touch.clientX - getBoundingClientRect(target).left;
  return getPercentage(offsetX, target.offsetWidth);
}

export function Slider({
  value,
  hoverIndicator,
  adMarkerPositions,
  onSelect,
}: ISlider) {
  value = Math.min(value, 100);
  const [pointerPosition, setPointerPosition] = useState(-1);

  //Controlling Boundary of thumbnail.
  const sliderRect = useRef<HTMLDivElement>(null);
  const spriteRect = useRef<HTMLSpanElement>(null);
  const sprite: DOMRect | undefined =
    spriteRect.current?.getBoundingClientRect();
  const slider: DOMRect | undefined =
    sliderRect.current?.getBoundingClientRect();
  const [xTranslate, setXTranslate] = useState(50);
  const [lower, setLower] = useState<number>(0);
  const [upper, setUpper] = useState<number>(0);
  const [spritePosition, setSpritePosition] = useState(pointerPosition);

  const onTouchStartAndMove = useCallback((evt: TouchEvent) => {
    evt.preventDefault();
    setPointerPosition(getTouchPercentage(evt));
  }, []);

  const onTouchEnd = useCallback(
    (evt: TouchEvent) => {
      evt.preventDefault();
      onSelect(getTouchPercentage(evt));
      setPointerPosition(-1);

      clearBoundingClientRectCache(evt.currentTarget as HTMLDivElement);
    },
    [onSelect]
  );

  const onMouseMove = useCallback((evt: MouseEvent) => {
    const width = (evt.currentTarget as HTMLDivElement).offsetWidth;
    const percentage = getPercentage(evt.offsetX, width);
    setPointerPosition(percentage);
  }, []);

  const onMouseLeave = useCallback(() => {
    setPointerPosition(-1);
  }, []);

  const onMouseUp = useCallback(
    (evt: MouseEvent) => {
      const width = (evt.currentTarget as HTMLDivElement).offsetWidth;
      onSelect(getPercentage(evt.offsetX, width));
    },
    [onSelect]
  );

  const isPointerActive = pointerPosition > -1;
  const hoverBarStyle = { left: "0", width: "0" };
  if (isPointerActive) {
    if (value > pointerPosition) {
      hoverBarStyle.left = `${value - (value - pointerPosition)}%`;
      hoverBarStyle.width = `${value - pointerPosition}%`;
    } else if (value < pointerPosition) {
      hoverBarStyle.left = `${value}%`;
      hoverBarStyle.width = `${pointerPosition - value}%`;
    }
  }

  useLayoutEffect(() => {
    if (sprite && slider) {
      const SpritePercentOfSlider = getPercentage(sprite.width, slider.width);
      const lowerboundary = parseFloat((SpritePercentOfSlider / 2).toFixed(2));
      setLower(lowerboundary);
      const upperBoundary = parseFloat(
        (100 - SpritePercentOfSlider / 2).toFixed(2)
      );
      setUpper(upperBoundary);
      if (pointerPosition > lowerboundary && pointerPosition < upperBoundary) {
        setXTranslate(50);
      } else if (pointerPosition <= lowerboundary) {
        setSpritePosition(0);
        setXTranslate(0);
      } else if (pointerPosition >= upperBoundary) {
        setSpritePosition(100);
        setXTranslate(100);
      }
    }
  }, [pointerPosition, slider, sprite, xTranslate]);

  const leftValue = (pointerPosition: number): number => {
    return pointerPosition < lower || pointerPosition > upper
      ? spritePosition
      : pointerPosition;
  };

  const transformValue = (pointerPosition: number): number => {
    return pointerPosition < lower || pointerPosition > upper ? xTranslate : 50;
  };

  return (
    <div
      ref={sliderRect}
      class={style.container}
      onTouchStart={onTouchStartAndMove}
      onTouchMove={onTouchStartAndMove}
      onTouchEnd={onTouchEnd}
      onMouseMove={onMouseMove}
      onMouseUp={onMouseUp}
      onMouseLeave={onMouseLeave}
    >
      {hoverIndicator && isPointerActive && (
        <span
          ref={spriteRect}
          class={style.hoverIndicator}
          style={{
            left: `${leftValue(pointerPosition)}%`,
            transform: `TranslateX(-${transformValue(pointerPosition)}%)`,
          }}
        >
          {hoverIndicator(pointerPosition)}
        </span>
      )}
      <div class={style.wrapper}>
        <div class={style.progress} style={{ width: `${value}%` }}>
          <div className={style.indicator} />
        </div>
        {adMarkerPositions && (
          <div className={style.adBreakContainer}>
            {adMarkerPositions.map((adMarkerPosition, index) => (
              <span
                key={`${index}-${adMarkerPosition}`}
                className={style.marker}
                style={{ left: `${adMarkerPosition}%` }}
              />
            ))}
          </div>
        )}
        <div class={style.hoverBar} style={hoverBarStyle} />
      </div>
    </div>
  );
}
