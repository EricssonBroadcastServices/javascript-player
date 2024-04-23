// SPDX-FileCopyrightText: 2024 Red Bee Media Ltd <https://www.redbeemedia.com/>
//
// SPDX-License-Identifier: MIT

import classNames from "classnames";
import { h } from "preact";
import { useCallback, useEffect, useState } from "preact/hooks";

import { useController } from "../../hooks/useController";
import { formatPlayerTime, formatPlayerWallClockTime } from "../../utils/time";
import { Slider } from "../slider/Slider";
import style from "./progressBar.module.scss";

function getProgressPercentage(
  start: number,
  end: number,
  currentTime: number
) {
  const seekableDuration = end - start;
  return parseFloat(
    (((currentTime - start) / seekableDuration) * 100).toFixed(2)
  );
}

type HoverIndicatorProps = {
  isLive?: boolean;
  showWallClock?: boolean;
  timeZone?: string;
  spriteCue?: any;
  time: number;
  duration: number;
};

function HoverIndicator({
  isLive,
  showWallClock,
  timeZone,
  spriteCue,
  time,
  duration,
}: HoverIndicatorProps) {
  let text;
  if (showWallClock) {
    text = formatPlayerWallClockTime(time, timeZone);
  } else if (isLive) {
    text = `- ${formatPlayerTime(Math.max(duration - time, 0))}`;
  } else {
    text = `${formatPlayerTime(Math.max(time, 0))}`;
  }

  const [isLoaded, setLoaded] = useState(false);
  useEffect(() => {
    setLoaded(false);
    if (spriteCue?.image) {
      const image = new Image();
      image.onload = () => setLoaded(true);
      image.src = spriteCue.image;
      return () => (image.onload = null);
    }
  }, [spriteCue?.image]);

  return (
    <div class={style.hoverIndicator}>
      {spriteCue && (
        <div
          class={classNames(style.sprite, { [style.visible]: isLoaded })}
          style={{
            width: `${spriteCue.dimensions.width}px`,
            height: `${spriteCue.dimensions.height}px`,
            backgroundImage: `url(${spriteCue.image})`,
            backgroundPosition: `${-spriteCue.dimensions.x}px ${-spriteCue
              .dimensions.y}px`,
          }}
        />
      )}
      <span>{text}</span>
    </div>
  );
}

export default function ProgressBar({
  seekable,
  isLive,
  currentTime,
  timelineSpriteCues,
  showWallClock,
  timeZone,
  utcSeekable,
  adMarkerPositions,
}: {
  seekable: { start: number; end: number };
  isLive: boolean;
  currentTime: number;
  timelineSpriteCues: any[];
  showWallClock: boolean;
  timeZone?: string;
  utcCurrentTime: number;
  utcSeekable: { start: number; end: number };
  adMarkerPositions?: number[];
}) {
  const controller = useController();

  const duration = showWallClock
    ? (utcSeekable.end - utcSeekable.start) / 1000
    : seekable.end - seekable.start;

  const onProgressClick = useCallback(
    (percentage: number) => {
      const seekable = controller?.getSeekable();
      if (seekable) {
        const time =
          seekable.start + (percentage * (seekable.end - seekable.start)) / 100;
        controller?.seekTo(time);
      }
    },
    [controller]
  );

  const hoverIndicator = useCallback(
    (percentage: number) => {
      const positionInSeconds = (percentage / 100) * duration;
      const spriteCue = timelineSpriteCues.find(
        (cue) => positionInSeconds >= cue.start && positionInSeconds < cue.end
      );

      return (
        <HoverIndicator
          isLive={isLive}
          showWallClock={showWallClock}
          timeZone={timeZone}
          spriteCue={spriteCue}
          time={
            showWallClock
              ? utcSeekable.start + positionInSeconds * 1000
              : positionInSeconds
          }
          duration={duration}
        />
      );
    },
    [
      duration,
      timelineSpriteCues,
      isLive,
      showWallClock,
      timeZone,
      utcSeekable.start,
    ]
  );

  const percentage = getProgressPercentage(
    seekable.start,
    seekable.end,
    currentTime
  );

  return (
    <Slider
      value={percentage}
      onSelect={onProgressClick}
      hoverIndicator={hoverIndicator}
      adMarkerPositions={adMarkerPositions}
    />
  );
}
