// SPDX-FileCopyrightText: 2024 Red Bee Media Ltd <https://www.redbeemedia.com/>
//
// SPDX-License-Identifier: MIT

import classNames from "classnames";
import { h } from "preact";
import { useRef, useState } from "preact/hooks";

import type { CastSender } from "@ericssonbroadcastservices/js-player-cast-sender";
import {
  ContentType,
  PlaybackState,
} from "@ericssonbroadcastservices/js-player-shared";

import { useCastSenderState } from "../../../hooks/useCast";
import { ISkinOptions } from "../../../options";
import { VIEW_TYPE } from "../../../utils/constants";
import {
  formatPlayerTime,
  formatPlayerWallClockTime,
} from "../../../utils/time";
import { AdIndexLabel } from "../../AdIndexLabel/AdIndexLabel";
import ContentMarkersButton from "../../buttons/contentMarkersButton/ContentMarkersButton";
import JumpBackButton from "../../buttons/jump/JumpBackButton";
import JumpForwardButton from "../../buttons/jump/JumpForwardButton";
import LiveButton from "../../buttons/live/LiveButton";
import PlayPauseStopButton from "../../buttons/playPauseStop/PlayPauseStopButton";
import SettingsButton from "../../buttons/settings/SettingsButton";
import ToggleSubtitlesButton from "../../buttons/toggleSubtitles/ToggleSubtitlesButton";
import VolumeButton from "../../buttons/volume/VolumeButton";
import CastBackground from "../../castBackground/CastBackground";
import CuePointsMenu from "../../contentMarkerMenu/contentMarkerMenu";
import ProgressBar from "../../progressBar/ProgressBar";
import SettingsMenu, {
  isSettingsAvailable,
} from "../../settingsMenu/SettingsMenu";
import style from "./castSkin.module.scss";

type CastSkinProps = {
  castSender: CastSender;
  options: ISkinOptions;
  locale: string;
};

export default function CastSkin({
  castSender,
  options,
  locale,
}: CastSkinProps) {
  const [playerState, metadata] = useCastSenderState(castSender, locale);
  const [activeView, setActiveView] = useState<VIEW_TYPE>();

  const hideJumpBackward = !playerState.isSeekable || !options.showJumpButtons;

  const hideJumpForward =
    !playerState.isSeekable ||
    !options.showJumpButtons ||
    playerState.isAtLiveEdge;

  const showWallClock = options.showWallClock && playerState.utcDuration > -1;
  const currentTimeString = showWallClock
    ? formatPlayerWallClockTime(playerState.utcCurrentTime, options.timeZone)
    : formatPlayerTime(playerState.currentTime);
  const durationTimeString = showWallClock
    ? formatPlayerWallClockTime(playerState.utcDuration, options.timeZone)
    : formatPlayerTime(playerState.duration);

  const adMarkerPositions =
    playerState.adMarkers?.map(
      (adMarker) => (adMarker.startTime / playerState.duration) * 100
    ) || [];

  const showContentMarkerMenuButton = !!playerState.contentMarkers?.filter(
    (cm) => cm.type === "CHAPTER" || cm.type === "POINT"
  ).length;

  const menuRef = useRef<HTMLDivElement>(null);

  const endedIdle = [PlaybackState.IDLE, PlaybackState.ENDED].some(
    (state) => state === playerState.playbackState
  );

  return (
    <div class={style.wrapper}>
      <CastBackground title={metadata.title} image={metadata.imageUrl} />
      {playerState.contentType === ContentType.AD &&
        playerState.currentAd?.adIndex &&
        playerState.currentAd?.adsTotal && (
          <AdIndexLabel
            currentAdIndex={playerState.currentAd?.adIndex}
            currentAdBreakTotal={playerState.currentAd?.adsTotal}
            translations={options?.translations}
          />
        )}
      {
        <CuePointsMenu
          visible={activeView === VIEW_TYPE.CONTENT_MARKERS_MENU}
          contentMarkers={playerState.contentMarkers ?? []}
          duration={playerState.duration}
          fillScreen={true}
          setActiveView={(view?: VIEW_TYPE) => setActiveView(view)}
          locale={locale}
        />
      }
      {
        <SettingsMenu
          visible={activeView === VIEW_TYPE.SETTINGS_MENU}
          fillScreen={true}
          audioTrack={playerState.audioTrack}
          subtitleTrack={playerState.subtitleTrack}
          setActiveView={setActiveView}
          subtitleTracks={playerState.subtitleTracks}
          audioTracks={playerState.audioTracks}
          qualityLevel={playerState.qualityLevel}
          qualityLevels={playerState.qualityLevels}
        />
      }
      {!activeView && (
        <div ref={menuRef} class={classNames(style.bottomContainer)}>
          {!endedIdle && (
            <div class={classNames(style.topControls)}>
              {!hideJumpBackward && <JumpBackButton />}
              <PlayPauseStopButton
                pausable={
                  playerState.contentType === ContentType.AD ||
                  playerState.isSeekable
                }
                state={playerState.playbackState}
                className={style.playPauseStop}
              />
              {!hideJumpForward && <JumpForwardButton />}
            </div>
          )}

          <div class={style.controls}>
            <div class={style.buttons}>
              {playerState.isLive && (
                <LiveButton isAtLiveEdge={playerState.isAtLiveEdge} />
              )}
              {!endedIdle && !playerState.isLive && (
                <span class={style.time}>
                  {currentTimeString} / {durationTimeString}
                </span>
              )}
              <div class={style.divider} />
              {showContentMarkerMenuButton && (
                <ContentMarkersButton
                  toggleMenu={
                    activeView === VIEW_TYPE.CONTENT_MARKERS_MENU
                      ? () => setActiveView(undefined)
                      : () => setActiveView(VIEW_TYPE.CONTENT_MARKERS_MENU)
                  }
                />
              )}
              {isSettingsAvailable({
                audioTracks: playerState.audioTracks,
                subtitleTracks: playerState.subtitleTracks,
                ...(options.showQualitySelector && {
                  qualityLevels: playerState.qualityLevels,
                }),
              }) && (
                <SettingsButton
                  toggleMenu={
                    activeView === VIEW_TYPE.SETTINGS_MENU
                      ? () => setActiveView(undefined)
                      : () => setActiveView(VIEW_TYPE.SETTINGS_MENU)
                  }
                />
              )}
              {options.showSubtitlesToggleButton &&
                playerState.subtitleTracks.length === 1 && (
                  <ToggleSubtitlesButton
                    isEnabled={Boolean(playerState.subtitleTrack)}
                  />
                )}
              {/*@ts-ignore*/}
              <google-cast-launcher />
              <VolumeButton
                muted={playerState.isMuted}
                volume={playerState.volume || 0}
                disableSlider={true}
              />
            </div>
            {playerState.isSeekable && (
              <ProgressBar
                isLive={playerState.isLive}
                currentTime={playerState.currentTime}
                seekable={playerState.seekable}
                timelineSpriteCues={[]}
                showWallClock={showWallClock ?? false}
                timeZone={options.timeZone}
                utcCurrentTime={playerState.utcCurrentTime}
                utcSeekable={playerState.utcSeekable}
                adMarkerPositions={adMarkerPositions}
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
}
