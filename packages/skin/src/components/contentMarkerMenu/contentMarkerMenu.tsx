// SPDX-FileCopyrightText: 2024 Red Bee Media Ltd <https://www.redbeemedia.com/>
//
// SPDX-License-Identifier: MIT

import { MarkerPoint } from "@ericssonbroadcastservices/rbm-ott-sdk";
import classNames from "classnames";
import CloseIcon from "mdi-preact/CloseIcon";
import MapMarker from "mdi-preact/MapMarkerIcon";
import { h } from "preact";
import { memo } from "preact/compat";

import { getLocalizedTitle } from "@ericssonbroadcastservices/js-player-shared";

import { useController } from "../../hooks/useController";
import { VIEW_TYPE } from "../../utils/constants";
import { formatPlayerTime } from "../../utils/time";
import style from "./contentMarkerMenu.module.scss";

export function toSeconds(ms: number) {
  return ms / 1000;
}

const ContentMarkerSelector = memo(
  ({
    items,
    icon,
    setActiveView,
    locale,
  }: {
    items: MarkerPoint[];
    icon: any;
    locale: string;
    setActiveView: (activeView?: VIEW_TYPE) => void;
  }) => {
    const controller = useController();
    if (!items) return null;
    return (
      <div class={style.selectMenu}>
        <div class={style.menuHeader}>{icon}</div>
        <ul>
          {items.map((contentMarker, i) => {
            return (
              <li
                key={`${contentMarker.type}_${i}`}
                // eslint-disable-next-line react-hooks/rules-of-hooks
                onClick={() => {
                  controller?.seekTo(toSeconds(contentMarker.offset));
                  setActiveView(undefined);
                }}
              >
                <div class={style.item}>
                  <div class={style.itemTime}>
                    {formatPlayerTime(contentMarker.offset / 1000)}
                  </div>
                  <div class={style.itemText}>
                    <div>
                      {getLocalizedTitle(contentMarker.localized ?? [], locale)}
                    </div>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    );
  }
);

interface IContentMarkerMenu {
  visible: boolean;
  contentMarkers: MarkerPoint[];
  duration: number;
  fillScreen: boolean;
  locale: string;
  setActiveView: (activeView?: VIEW_TYPE) => void;
}

function ContentMarkerMenu({
  visible,
  contentMarkers = [],
  fillScreen,
  locale,
  setActiveView,
}: IContentMarkerMenu) {
  return (
    <div
      class={classNames(style.container, {
        [style.fullscreen]: fillScreen,
        [style.window]: !fillScreen,
        [style.hidden]: !visible,
      })}
    >
      <div onClick={() => setActiveView(undefined)} class={style.header}>
        <CloseIcon />
      </div>
      <div class={style.menuWrapper}>
        {!!contentMarkers.length && (
          <ContentMarkerSelector
            icon={<MapMarker />}
            items={contentMarkers.filter(
              (marker) => marker.type === "POINT" || marker.type === "CHAPTER"
            )}
            setActiveView={setActiveView}
            locale={locale}
          />
        )}
      </div>
    </div>
  );
}

export default memo(ContentMarkerMenu);
