// SPDX-FileCopyrightText: 2024 Red Bee Media Ltd <https://www.redbeemedia.com/>
//
// SPDX-License-Identifier: MIT

import { Asset } from "@ericssonbroadcastservices/rbm-ott-sdk";
import humanizeDuration from "humanize-duration";

import {
  LiveAsset,
  getAssetDescription,
  getAssetTitle,
  getLocalizedImageByType,
} from "@ericssonbroadcastservices/js-player-shared";

import { getTimeSpanString } from "./time";

export interface IAssetMetadata {
  image: string;
  title: string;
  duration?: string;
  description: string;
}

export const metadataFromAsset = (
  asset: Asset,
  program?: LiveAsset,
  language = "en"
): IAssetMetadata => {
  // If the asset is a channel, the backend may provide the ongoing program if such data exists
  // Then we should use the program's data instead of the channel's.
  let activeAsset = asset;
  if (program?.asset) {
    activeAsset = program.asset;
  }
  const title = getAssetTitle(activeAsset, language) ?? "";
  const description = getAssetDescription(activeAsset, language) ?? "";
  const image =
    getLocalizedImageByType(
      activeAsset.localized,
      "LANDSCAPE",
      "cover",
      language
    )?.url ?? "";

  const metadata: IAssetMetadata = {
    image,
    title,
    description,
  };

  // On program playing from a channel we want to apply a wall clock time span rather than the duration as such
  if (program?.startTime && program.endTime) {
    metadata.duration = getTimeSpanString(
      new Date(program.startTime),
      new Date(program.endTime)
    );
  } else if (asset.duration) {
    metadata.duration = getDuration(asset.duration, language);
  }
  return metadata;
};

function getDuration(duration: number, language: string): string {
  return humanizeDuration(duration, {
    language,
    fallbacks: ["en"],
    round: true,
  });
}
