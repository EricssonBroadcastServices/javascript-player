// SPDX-FileCopyrightText: 2024 Red Bee Media Ltd <https://www.redbeemedia.com/>
//
// SPDX-License-Identifier: MIT

import { h } from "preact";

import { formatPlayerTime, formatPlayerWallClockTime } from "../../utils/time";
import LiveButton from "../buttons/live/LiveButton";
import ProgressBar from "../progressBar/ProgressBar";
import style from "./timeline.module.scss";

export default function Timeline({
  seekable,
  isLive,
  currentTime,
  isAtLiveEdge,
  timelineSpriteCues,
  showWallClock,
  timeZone,
  utcCurrentTime,
  utcSeekable,
  adMarkerPositions,
}: {
  seekable: { start: number; end: number };
  isLive: boolean;
  currentTime: number;
  isAtLiveEdge: boolean;
  timelineSpriteCues: any[];
  showWallClock: boolean;
  timeZone?: string;
  utcCurrentTime: number;
  utcSeekable: { start: number; end: number };
  adMarkerPositions?: number[];
}) {
  const duration = seekable.end - seekable.start;

  const liveTimeString = isAtLiveEdge
    ? "00:00"
    : `- ${formatPlayerTime(seekable.end - currentTime)}`;
  const timeString = showWallClock
    ? formatPlayerWallClockTime(utcCurrentTime, timeZone)
    : isLive
    ? liveTimeString
    : formatPlayerTime(currentTime);

  return (
    <div class={style.container}>
      <span class={style.time}>{timeString}</span>
      <ProgressBar
        seekable={seekable}
        isLive={isLive}
        currentTime={currentTime}
        timelineSpriteCues={timelineSpriteCues}
        showWallClock={showWallClock}
        timeZone={timeZone}
        utcCurrentTime={utcCurrentTime}
        utcSeekable={utcSeekable}
        adMarkerPositions={adMarkerPositions}
      />
      {isLive ? (
        <LiveButton isAtLiveEdge={isAtLiveEdge} />
      ) : (
        <span class={style.time}>
          {showWallClock
            ? formatPlayerWallClockTime(utcSeekable.end, timeZone)
            : formatPlayerTime(duration)}
        </span>
      )}
    </div>
  );
}
