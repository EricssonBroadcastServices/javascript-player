// SPDX-FileCopyrightText: 2024 Red Bee Media Ltd <https://www.redbeemedia.com/>
//
// SPDX-License-Identifier: MIT

export interface IHLSPlaylist {
  url?: string;
  width: number;
  height: number;
  bitrate: number;
}

const HLS_ATTRIBUTE_REGEXP = new RegExp(
  '(?:,?)([A-Z0-9-]+?)[=](".*?"|[^",]+)(?=,|s*$)',
  "g"
);

export async function getPlaylists(src: string): Promise<IHLSPlaylist[]> {
  const response = await fetch(src);
  if (!response.ok) {
    return [];
  }
  const manifestString = await response.text();
  const manifestLines = manifestString.split("\n");
  const playlists: IHLSPlaylist[] = [];

  manifestLines.forEach((line, index) => {
    const playlist: IHLSPlaylist = {
      url: undefined,
      width: 0,
      height: 0,
      bitrate: 0,
    };
    if (line.includes("#EXT-X-STREAM-INF")) {
      let valid = false;
      playlist.url = manifestLines[index + 1];
      let group: string[] | null;
      while ((group = HLS_ATTRIBUTE_REGEXP.exec(line)) !== null) {
        const [, attribute, value] = group;
        switch (attribute) {
          case "BANDWIDTH":
            valid = true;
            playlist.bitrate = Number(value);
            break;
          case "RESOLUTION": {
            const [width, height] = value.split("x");
            playlist.width = Number(width);
            playlist.height = Number(height);
            break;
          }
        }
      }
      if (valid) {
        playlists.push(playlist);
      }
    }
  });
  return playlists;
}
