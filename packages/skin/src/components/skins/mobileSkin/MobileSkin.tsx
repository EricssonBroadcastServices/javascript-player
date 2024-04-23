// SPDX-FileCopyrightText: 2024 Red Bee Media Ltd <https://www.redbeemedia.com/>
//
// SPDX-License-Identifier: MIT

import classNames from "classnames";
import { h } from "preact";
import { useCallback, useEffect, useRef, useState } from "preact/hooks";

import {
  ContentType,
  PlaybackState,
} from "@ericssonbroadcastservices/js-player-shared";

import { usePlayerCoreState } from "../../../hooks/usePlayerCore";
import { IPlayerSkinEvents } from "../../../PlayerSkin";
import { VIEW_TYPE } from "../../../utils/constants";
import {
  formatPlayerTime,
  formatPlayerWallClockTime,
} from "../../../utils/time";
import { AdIndexLabel } from "../../AdIndexLabel/AdIndexLabel";
import { AdClickThroughButton } from "../../buttons/AdClickThroughButton/AdClickThroughButton";
import AirPlayButton from "../../buttons/airplay/AirPlayButton";
import ContentMarkersButton from "../../buttons/contentMarkersButton/ContentMarkersButton";
import FullscreenButton from "../../buttons/fullscreen/FullscreenButton";
import JumpBackButton from "../../buttons/jump/JumpBackButton";
import JumpForwardButton from "../../buttons/jump/JumpForwardButton";
import LiveButton from "../../buttons/live/LiveButton";
import PictureInPictureButton from "../../buttons/pictureInPicture/PictureInPictureButton";
import PlayPauseStopButton from "../../buttons/playPauseStop/PlayPauseStopButton";
import SettingsButton from "../../buttons/settings/SettingsButton";
import ToggleSubtitlesButton from "../../buttons/toggleSubtitles/ToggleSubtitlesButton";
import VolumeButton from "../../buttons/volume/VolumeButton";
import CuePointsMenu from "../../contentMarkerMenu/contentMarkerMenu";
import Gestures from "../../gestures/Gestures";
import ProgressBar from "../../progressBar/ProgressBar";
import SettingsMenu, {
  isSettingsAvailable,
} from "../../settingsMenu/SettingsMenu";
import { ISkin } from "../fullSkin/FullSkin";
import { useIsSkinHidden } from "../useIsSkinHidden";
import { useUserActive } from "../useUserActive";
import style from "./mobileSkin.module.scss";

export default function MobileSkin({
  playerCore,
  options,
  locale,
  isCastAvailable,

  onSkinHidden,
  onSkinVisible,
}: ISkin & IPlayerSkinEvents) {
  const [playerState, metadata] = usePlayerCoreState(playerCore, locale);

  const [activeView, setActiveView] = useState<VIEW_TYPE>();

  const [isUserActive, triggerUserActive, toggleUserActive] = useUserActive({
    userActiveTimeout: options.hideControlsTimer ?? 2500,
  });

  const onSingleTap = useCallback(() => {
    toggleUserActive();
  }, [toggleUserActive]);

  const isSkinHidden =
    playerState.hasStarted &&
    !isUserActive &&
    !activeView &&
    playerState.playbackState !== PlaybackState.IDLE;

  useIsSkinHidden({ onSkinHidden, onSkinVisible, isSkinHidden });

  const hideJumpBackward =
    !playerState.isSeekable ||
    !options.showJumpButtons ||
    (playerState.contractRestrictions &&
      playerState.contractRestrictions.rwEnabled === false);

  const hideJumpForward =
    !playerState.isSeekable ||
    !options.showJumpButtons ||
    (playerState.contractRestrictions &&
      playerState.contractRestrictions.ffEnabled === false) ||
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

  const clickThroughUrl = playerState.currentAd?.clickThrough;
  const showClickThroughButton = !!(
    clickThroughUrl &&
    activeView !== VIEW_TYPE.CONTENT_MARKERS_MENU &&
    activeView !== VIEW_TYPE.SETTINGS_MENU
  );

  const menuRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    // add bottom offset to subtitle container based on bottom menu height
    // (which is dynamic and updates in a lot of events)
    const bottomOffset = isSkinHidden ? 0 : menuRef.current?.clientHeight ?? 0;
    playerCore.getSubtitleContainerElement().style.marginBottom = `${bottomOffset}px`;
  }, [isSkinHidden, playerCore, menuRef, playerState.isSeekable, activeView]);

  return (
    <div class={style.wrapper} onMouseMove={triggerUserActive}>
      <Gestures onSingleTap={onSingleTap} isSkinHidden={isSkinHidden} />
      {playerState.contentType === ContentType.AD &&
        playerState.currentAd?.adIndex &&
        playerState.currentAd?.adsTotal && (
          <AdIndexLabel
            currentAdIndex={playerState.currentAd?.adIndex}
            currentAdBreakTotal={playerState.currentAd?.adsTotal}
            isMobile={true}
            translations={options?.translations}
          />
        )}
      {showClickThroughButton && (
        <AdClickThroughButton
          isMobile={true}
          onClickThrough={() => playerCore.clickThrough()}
          clickThroughUrl={clickThroughUrl}
          translations={options?.translations}
        />
      )}
      <div
        class={classNames(style.centerContainer, {
          [style.hidden]: isSkinHidden,
        })}
      >
        {!hideJumpBackward && <JumpBackButton />}
        <PlayPauseStopButton
          pausable={playerState.isSeekable}
          state={playerState.playbackState}
          className={style.playPauseStop}
        />
        {!hideJumpForward && <JumpForwardButton />}
      </div>
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
        <div
          ref={menuRef}
          class={classNames(style.bottomContainer, {
            [style.hidden]: isSkinHidden,
          })}
        >
          <div class={style.controls}>
            <div class={style.buttons}>
              {playerState.isLive && (
                <LiveButton isAtLiveEdge={playerState.isAtLiveEdge} />
              )}
              {!playerState.isLive && (
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
              {playerState.isAirPlayAvailable && <AirPlayButton />}
              {/*@ts-ignore*/}
              {isCastAvailable && <google-cast-launcher />}
              {playerCore.isPictureInPictureSupported() &&
                options.allowPictureInPicture && <PictureInPictureButton />}
              <VolumeButton
                muted={playerState.isMuted}
                volume={playerState.volume || 0}
                disableSlider={true}
              />
              <FullscreenButton
                isFullscreen={playerCore.isFullscreen() ?? false}
              />
            </div>
            {playerState.isSeekable && (
              <ProgressBar
                isLive={playerState.isLive}
                currentTime={playerState.currentTime}
                seekable={playerState.seekable}
                timelineSpriteCues={metadata.timelineSpriteCues}
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
