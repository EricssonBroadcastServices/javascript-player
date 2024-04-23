// SPDX-FileCopyrightText: 2024 Red Bee Media Ltd <https://www.redbeemedia.com/>
//
// SPDX-License-Identifier: MIT

import { useEffect } from "preact/hooks";

export function useIsSkinHidden({
  onSkinHidden,
  onSkinVisible,
  isSkinHidden,
}: {
  onSkinHidden?: () => void;
  onSkinVisible?: () => void;
  isSkinHidden: boolean;
}) {
  useEffect(() => {
    if (isSkinHidden) {
      onSkinHidden?.();
    } else {
      onSkinVisible?.();
    }
  }, [isSkinHidden, onSkinHidden, onSkinVisible]);
}
