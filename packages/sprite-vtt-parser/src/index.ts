// SPDX-FileCopyrightText: 2024 Red Bee Media Ltd <https://www.redbeemedia.com/>
//
// SPDX-License-Identifier: MIT

import { buildAbsoluteURL } from "url-toolkit";
import { WebVTTParser } from "webvtt-parser";

interface IVTTCue {
  startTime: number;
  endTime: number;
  text: string;
}

interface IDimensions {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface ISpriteCue {
  image: string;
  start: number;
  end: number;
  dimensions: IDimensions;
}

/**
 * parse dimensions from the string image.jpg#xywh=0,0,160,90
 * into {IDimensions}
 * @param  {string}      text
 * @return {IDimensions}
 */
export function parseDimensions(text: string): IDimensions | undefined {
  const values = text.split("#xywh=")[1]?.split(",");
  if (values && values.length === 4) {
    return {
      x: parseInt(values[0], 10),
      y: parseInt(values[1], 10),
      width: parseInt(values[2], 10),
      height: parseInt(values[3], 10),
    };
  }
}

/**
 * parse image URL from the VTT text "image.jpg#xywh=0,0,160,90"
 * into an absolute url
 * @param  {string} text
 * @param  {string} vttUrl the VTT url which text string originates from
 * @return {string}
 */
export function parseImage(text: string, vttUrl: string): string | null {
  if (text) {
    return buildAbsoluteURL(vttUrl, text.split("#")[0]);
  }
  return null;
}

export function parseCue(
  cue: IVTTCue,
  vttUrl: string,
  offset: number
): ISpriteCue | undefined {
  const image = parseImage(cue.text, vttUrl);
  const dimensions = parseDimensions(cue.text);
  if (!image || !dimensions) {
    return;
  }
  return {
    start: cue.startTime - offset,
    end: cue.endTime - offset,
    image,
    dimensions,
  };
}

export function parseSpriteVTT(
  vtt: string,
  vttUrl: string,
  offset: number
): ISpriteCue[] {
  const parser = new WebVTTParser();
  const { cues }: { cues: IVTTCue[] } = parser.parse(vtt);

  return cues
    .map((cue) => parseCue(cue, vttUrl, offset))
    .filter((cue): cue is ISpriteCue => cue !== undefined);
}

export async function getTimelineSpriteCues(
  vttUrl: string,
  offset: number
): Promise<ISpriteCue[]> {
  const response = await fetch(vttUrl);
  const vtt = await response.text();
  return parseSpriteVTT(vtt, vttUrl, offset);
}
