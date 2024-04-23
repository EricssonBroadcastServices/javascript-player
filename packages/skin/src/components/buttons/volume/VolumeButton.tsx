// SPDX-FileCopyrightText: 2024 Red Bee Media Ltd <https://www.redbeemedia.com/>
//
// SPDX-License-Identifier: MIT

import classNames from "classnames";
import VolumeHighIcon from "mdi-preact/VolumeHighIcon";
import VolumeMuteIcon from "mdi-preact/VolumeMuteIcon";
import { h } from "preact";
import { memo } from "preact/compat";
import { useCallback, useRef, useState } from "preact/hooks";

import { useController } from "../../../hooks/useController";
import { Slider } from "../../slider/Slider";
import style from "./volume.module.scss";

interface IVolumeButton {
  muted: boolean;
  volume: number;
  disableSlider?: boolean;
}

const CLOSE_TIMEOUT = 1000;

function VolumeButton({ muted, volume, disableSlider }: IVolumeButton) {
  const controller = useController();

  const timeoutRef = useRef<number>();
  const [isOpen, setOpen] = useState(false);
  const onMouseOver = useCallback(() => {
    window.clearTimeout(timeoutRef.current);
    if (!disableSlider) {
      setOpen(true);
    }
  }, [disableSlider]);
  const onMouseOut = useCallback(
    () =>
      (timeoutRef.current = window.setTimeout(
        () => setOpen(false),
        CLOSE_TIMEOUT
      )),
    []
  );

  return (
    <div
      class={classNames(style.container, { [style.noSlider]: disableSlider })}
      onMouseOver={onMouseOver}
      onMouseOut={onMouseOut}
    >
      <div
        class={style.buttonContainer}
        onClick={() => controller?.toggleMuted()}
      >
        {muted ? <VolumeMuteIcon /> : <VolumeHighIcon />}
      </div>
      <div class={classNames(style.volumeContainer, { [style.open]: isOpen })}>
        <Slider
          onSelect={(value) => controller?.setVolume({ percentage: value })}
          value={volume * 100}
        />
      </div>
    </div>
  );
}

export default memo(VolumeButton);
