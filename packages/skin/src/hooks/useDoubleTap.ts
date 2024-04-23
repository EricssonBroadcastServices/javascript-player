// SPDX-FileCopyrightText: 2024 Red Bee Media Ltd <https://www.redbeemedia.com/>
//
// SPDX-License-Identifier: MIT

import { useCallback, useRef } from "preact/hooks";

type UseDoubleTapProps = {
  doubleTap?: () => void;
  singleTap?: () => void;
};

export default function useDoubleTap({
  doubleTap,
  singleTap,
}: UseDoubleTapProps) {
  const timer = useRef<number>();

  const onTouchEnd = useCallback(
    (evt: MouseEvent | TouchEvent) => {
      evt.preventDefault();
      evt.stopPropagation();
      if (timer.current) {
        window.clearTimeout(timer.current);
        timer.current = undefined;
        doubleTap?.();
      } else {
        timer.current = window.setTimeout(() => {
          singleTap?.();
          timer.current = undefined;
        }, 300);
      }
    },
    [doubleTap, singleTap]
  );

  return onTouchEnd;
}
