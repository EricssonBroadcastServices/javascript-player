// SPDX-FileCopyrightText: 2024 Red Bee Media Ltd <https://www.redbeemedia.com/>
//
// SPDX-License-Identifier: MIT

function getTimeFormatter(
  timeZone?: string,
  includeSeconds = true
): Intl.DateTimeFormat {
  try {
    // Note "sv-SE" format is what we used before, to avoid AM/PM and no 24:00
    // It is just one of several European locales producing the same results.
    // If we want to use the default locale instead, we should use undefined
    return new Intl.DateTimeFormat("sv-SE", {
      hour: "2-digit",
      minute: "2-digit",
      ...(includeSeconds && { second: "2-digit" }),
      ...(timeZone && { timeZone }),
    });
  } catch (err) {
    if (timeZone) {
      // Fall back to locale default if invalid time zone
      return getTimeFormatter(undefined, includeSeconds);
    }
    throw err;
  }
}

export function getTimeSpanString(startTime: Date, endTime: Date): string {
  // Note standard method formatRange exists, but browser support isn't great yet:
  // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat/formatRange
  return [startTime, endTime]
    .map((time) => getTimeFormatter(undefined, false).format(time))
    .join(" - ");
}

export function formatPlayerTime(sec = 0) {
  const h = Math.floor(sec / 3600) % 24;
  const m = Math.floor(sec / 60) % 60;
  const s = Math.floor(sec % 60);
  return [h, m, s]
    .map((v) => (v < 10 ? `0${v}` : v))
    .filter((v, i) => v !== "00" || i > 0)
    .join(":");
}

export function formatPlayerWallClockTime(
  unixTimestamp: number,
  timeZone?: string
): string {
  const formatter = getTimeFormatter(timeZone);
  if (new Date(unixTimestamp).getFullYear() === 1970) {
    unixTimestamp = unixTimestamp * 1000;
  }
  return formatter.format(new Date(unixTimestamp));
}
