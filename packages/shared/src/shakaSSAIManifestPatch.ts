// SPDX-FileCopyrightText: 2024 Red Bee Media Ltd <https://www.redbeemedia.com/>
//
// SPDX-License-Identifier: MIT

import { AdClip, AdClipCategory } from "@ericssonbroadcastservices/rbm-ott-sdk";

function getAudioAdaptionSetsFromClipCategory(
  periods: NodeListOf<Element>,
  clips: AdClip[],
  category: AdClipCategory
) {
  return clips.flatMap((clip, index) => {
    if (clip.category !== category) {
      return [];
    }
    return Array.from(
      periods[index].querySelectorAll(
        "AdaptationSet[lang][mimeType^=audio/*] Representation, AdaptationSet[lang] Representation[mimeType^=audio/*]"
      )
    ).flatMap((e) => e.closest("AdaptationSet") || []);
  });
}

// Revert Shakas audio track normalization for periods, causing ads only languages to appear in the normal options
// See https://github.com/shaka-project/shaka-player/issues/2887#issuecomment-701594716
export const patchShakaSSAIManifest =
  (clips: AdClip[] = []) =>
  (manifest: Element) => {
    const periods = manifest.querySelectorAll("Period");
    if (periods.length <= 1 || periods.length !== clips?.length) {
      return [];
    }
    const firstAudioLang = getAudioAdaptionSetsFromClipCategory(
      periods,
      clips,
      "vod"
    )?.[0]?.getAttribute("lang");

    if (firstAudioLang) {
      getAudioAdaptionSetsFromClipCategory(periods, clips, "ad").forEach((el) =>
        el.setAttribute("lang", firstAudioLang)
      );
    }
  };
