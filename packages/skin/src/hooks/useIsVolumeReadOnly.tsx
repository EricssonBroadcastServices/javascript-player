// SPDX-FileCopyrightText: 2024 Red Bee Media Ltd <https://www.redbeemedia.com/>
//
// SPDX-License-Identifier: MIT

import { useEffect, useState } from "preact/hooks";

import type { PlayerCore } from "@ericssonbroadcastservices/js-player-core";

export function useIsVolumeReadOnly(core: PlayerCore) {
  const [isVolumeReadOnly, setIsVolumeReadOnly] = useState(true);

  useEffect(() => {
    core.isVolumeReadOnly().then((readOnly) => setIsVolumeReadOnly(readOnly));
  }, [core]);

  return isVolumeReadOnly;
}
