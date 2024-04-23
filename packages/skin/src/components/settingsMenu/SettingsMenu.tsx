// SPDX-FileCopyrightText: 2024 Red Bee Media Ltd <https://www.redbeemedia.com/>
//
// SPDX-License-Identifier: MIT

import classNames from "classnames";
import AccountVoiceIcon from "mdi-preact/AccountVoiceIcon";
import CloseIcon from "mdi-preact/CloseIcon";
import MovieCogIcon from "mdi-preact/MovieCogIcon";
import SubtitlesIcon from "mdi-preact/SubtitlesIcon";
import { h } from "preact";
import { memo } from "preact/compat";

import {
  QualityLevel,
  Track,
} from "@ericssonbroadcastservices/js-player-shared";

import { useController } from "../../hooks/useController";
import { VIEW_TYPE } from "../../utils/constants";
import style from "./settingsMenu.module.scss";

interface ISelectMenu {
  icon: any;
  items: Track[];
  selected: Track | null;
  onSelect: (id: Track) => void;
  isSubtitles?: boolean;
}

function SelectMenu({
  items,
  icon,
  onSelect,
  selected,
  isSubtitles,
}: ISelectMenu) {
  if (items.length === 0) return null;
  return (
    <div class={style.selectMenu}>
      <div class={style.menuHeader}>{icon}</div>
      <ul>
        {isSubtitles && (
          <li
            class={classNames(style.noSubtitle, {
              [style.selected]: !selected,
            })}
            // sending in NULL as the track is a special case supported by subtitles
            // TODO: this should be handled nicer
            onClick={() => onSelect(undefined as unknown as Track)}
          >
            {"Off"}
          </li>
        )}
        {items.map((t) => (
          <li
            key={t.id}
            class={
              t.language === selected?.language && t.label === selected?.label
                ? style.selected
                : ""
            }
            onClick={() => onSelect(t)}
          >
            {t.label}
          </li>
        ))}
      </ul>
    </div>
  );
}

function QualityLevelSelectMenu({
  items,
  icon,
  onSelect,
  selected,
}: {
  items: QualityLevel[];
  icon: any;
  onSelect: (qualityLevel: QualityLevel) => void;
  selected: QualityLevel;
}) {
  if (items.length === 0) return null;
  return (
    <div class={style.selectMenu}>
      <div class={style.menuHeader}>{icon}</div>
      <ul>
        {items.map((qualityLevel) => (
          <li
            key={qualityLevel.id}
            class={qualityLevel.id === selected.id ? style.selected : ""}
            onClick={() => onSelect(qualityLevel)}
          >
            {qualityLevel.name || qualityLevel.height}
          </li>
        ))}
      </ul>
    </div>
  );
}

interface ISettingsMenu {
  subtitleTrack: Track | null;
  subtitleTracks: Track[];
  audioTrack: Track | null;
  audioTracks: Track[];
  qualityLevel: QualityLevel;
  qualityLevels: QualityLevel[];
  fillScreen: boolean;
  visible: boolean;
  setActiveView: (activeView?: VIEW_TYPE) => void;
}

export function isSettingsAvailable({
  subtitleTracks,
  audioTracks,
  qualityLevels,
}: {
  subtitleTracks: Track[];
  audioTracks: Track[];
  qualityLevels?: QualityLevel[];
}) {
  return (
    subtitleTracks.length >= 1 ||
    audioTracks.length >= 2 ||
    (qualityLevels && qualityLevels.length > 2)
  );
}

function SettingsMenu({
  visible,
  subtitleTrack,
  subtitleTracks,
  audioTrack,
  audioTracks,
  qualityLevel,
  qualityLevels,
  fillScreen,
  setActiveView,
}: ISettingsMenu) {
  const controller = useController();
  return (
    <div
      class={classNames(style.container, {
        [style.fullscreen]: fillScreen,
        [style.window]: !fillScreen,
        [style.hidden]: !visible,
      })}
    >
      <div onClick={() => setActiveView()} class={style.header}>
        <CloseIcon />
      </div>
      <div class={style.menuWrapper}>
        {subtitleTracks && subtitleTracks.length >= 1 && (
          <SelectMenu
            selected={subtitleTrack}
            items={subtitleTracks}
            icon={<SubtitlesIcon />}
            onSelect={(track) => controller?.setSubtitleTrack(track)}
            isSubtitles
          />
        )}
        {audioTracks && audioTracks.length >= 2 && (
          <SelectMenu
            selected={audioTrack}
            items={audioTracks}
            icon={<AccountVoiceIcon />}
            onSelect={(track) => controller?.setAudioTrack(track)}
          />
        )}
        {qualityLevels && qualityLevels.length > 2 && (
          <QualityLevelSelectMenu
            icon={<MovieCogIcon />}
            selected={qualityLevel}
            items={qualityLevels}
            onSelect={(level) => controller?.setQualityLevel(level)}
          />
        )}
      </div>
    </div>
  );
}

export default memo(SettingsMenu);
