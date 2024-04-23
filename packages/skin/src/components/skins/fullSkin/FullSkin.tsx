// SPDX-FileCopyrightText: 2024 Red Bee Media Ltd <https://www.redbeemedia.com/>
//
// SPDX-License-Identifier: MIT

import classNames from "classnames";
import { h } from "preact";
import { useCallback, useEffect, useRef, useState } from "preact/hooks";

import type { PlayerCore } from "@ericssonbroadcastservices/js-player-core";
import {
  ContentType,
  PlaybackState,
} from "@ericssonbroadcastservices/js-player-shared";

import { useIsVolumeReadOnly } from "../../../hooks/useIsVolumeReadOnly";
import { usePlayerCoreState } from "../../../hooks/usePlayerCore";
import { ISkinOptions } from "../../../options";
import { IPlayerSkinEvents } from "../../../PlayerSkin";
import { VIEW_TYPE } from "../../../utils/constants";
import { isTouchDevice as checkIfTouchDevice } from "../../../utils/device";
import { AdIndexLabel } from "../../AdIndexLabel/AdIndexLabel";
import { AdClickThroughButton } from "../../buttons/AdClickThroughButton/AdClickThroughButton";
import AirPlayButton from "../../buttons/airplay/AirPlayButton";
import BigPlayButton from "../../buttons/bigPlay/BigPlayButton";
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
import ContentMarkerMenu from "../../contentMarkerMenu/contentMarkerMenu";
import Gestures from "../../gestures/Gestures";
import MetadataView from "../../metadataView/MetadataView";
import SettingsMenu, {
  isSettingsAvailable,
} from "../../settingsMenu/SettingsMenu";
import Timeline from "../../timeline/Timeline";
import { useIsSkinHidden } from "../useIsSkinHidden";
import { useUserActive } from "../useUserActive";
import style from "./fullSkin.module.scss";

export interface ISkin {
  playerCore: PlayerCore;
  options: ISkinOptions;
  locale: string;
  isCastAvailable: boolean;
}

export default function FullSkin({
  playerCore,
  options,
  locale,
  isCastAvailable,

  onSkinHidden,
  onSkinVisible,
}: ISkin & IPlayerSkinEvents) {
  const [playerState, metadata] = usePlayerCoreState(playerCore, locale);
  const isVolumeReadOnly = useIsVolumeReadOnly(playerCore);

  const [activeView, setActiveView] = useState<VIEW_TYPE>();

  const [isUserActive, triggerUserActive] = useUserActive({
    userActiveTimeout: options.hideControlsTimer ?? 2500,
  });

  const isTouchDevice = checkIfTouchDevice();

  const isSkinHidden =
    !isUserActive &&
    playerState.playbackState !== PlaybackState.IDLE &&
    playerState.playbackState !== PlaybackState.PAUSED &&
    activeView !== VIEW_TYPE.SETTINGS_MENU &&
    activeView !== VIEW_TYPE.CONTENT_MARKERS_MENU;

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

  const showStartButton =
    (!playerState.hasStarted ||
      (playerState.isLive && !playerState.isSeekable)) &&
    playerState.playbackState === PlaybackState.PAUSED;

  const showWallClock = options.showWallClock && playerState.utcDuration > -1;

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

  const onSingleTap = useCallback(() => {
    if (isTouchDevice) {
      triggerUserActive();
      return;
    }
    playerCore.clickThrough();
  }, [playerCore]);

  useEffect(() => {
    if (options.showMetadata && !activeView) {
      setActiveView(VIEW_TYPE.META_DATA_VIEW);
    }
  }, [activeView, options.showMetadata]);

  const menuRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    // add bottom offset to subtitle container based on bottom menu height
    // (which is dynamic and updates in a lot of events)
    const bottomOffset = isSkinHidden ? 0 : menuRef.current?.clientHeight ?? 0;
    playerCore.getSubtitleContainerElement().style.marginBottom = `${bottomOffset}px`;
  }, [isSkinHidden, playerCore, menuRef, playerState.isSeekable, activeView]);

  return (
    <div
      class={style.wrapper}
      onMouseMove={triggerUserActive}
      onTouchMove={triggerUserActive}
    >
      <Gestures
        onSingleTap={onSingleTap}
        isSkinHidden={isSkinHidden}
        pointer={showClickThroughButton}
      />
      {showStartButton && (
        <BigPlayButton
          poster={
            playerCore.getSession()?.loadOptions?.poster ||
            metadata?.asset?.image
          }
        />
      )}
      {playerState.contentType === ContentType.AD &&
        playerState.currentAd?.adIndex &&
        playerState.currentAd?.adsTotal && (
          <AdIndexLabel
            currentAdIndex={playerState.currentAd?.adIndex}
            currentAdBreakTotal={playerState.currentAd?.adsTotal}
            isMobile={false}
            translations={options?.translations}
          />
        )}
      {showClickThroughButton && (
        <AdClickThroughButton
          isMobile={false}
          onClickThrough={() => playerCore.clickThrough()}
          clickThroughUrl={clickThroughUrl}
          translations={options?.translations}
        />
      )}
      {!showStartButton && (
        <div
          class={classNames(style.bottomContainer, {
            [style.hidden]: isSkinHidden,
          })}
        >
          {
            <SettingsMenu
              fillScreen={false}
              visible={activeView === VIEW_TYPE.SETTINGS_MENU}
              audioTrack={playerState.audioTrack}
              audioTracks={playerState.audioTracks}
              subtitleTrack={playerState.subtitleTrack}
              subtitleTracks={playerState.subtitleTracks}
              qualityLevel={playerState.qualityLevel}
              qualityLevels={playerState.qualityLevels}
              setActiveView={setActiveView}
            />
          }
          <div ref={menuRef}>
            {options.showMetadata && (
              <MetadataView
                asset={metadata?.asset}
                visible={activeView === VIEW_TYPE.META_DATA_VIEW}
              />
            )}
            {
              <ContentMarkerMenu
                visible={activeView === VIEW_TYPE.CONTENT_MARKERS_MENU}
                contentMarkers={playerState.contentMarkers ?? []}
                duration={playerState.duration}
                fillScreen={false}
                locale={locale}
                setActiveView={setActiveView}
              />
            }
            <div class={style.controls}>
              <div class={style.buttons}>
                <PlayPauseStopButton
                  pausable={playerState.isSeekable}
                  state={playerState.playbackState}
                />
                {!hideJumpBackward && <JumpBackButton />}
                {!hideJumpForward && <JumpForwardButton />}
                <VolumeButton
                  muted={playerState.isMuted}
                  volume={playerState.volume || 0}
                  disableSlider={isVolumeReadOnly}
                />
                {playerState.isLive && !playerState.isSeekable && (
                  <LiveButton isAtLiveEdge={playerState.isAtLiveEdge} />
                )}
                <div class={style.divider} />
                <div class={style.menuButtons}>
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
                    subtitleTracks: playerState.subtitleTracks,
                    audioTracks: playerState.audioTracks,
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
                </div>
                {options.showSubtitlesToggleButton &&
                  playerState.subtitleTracks.length === 1 && (
                    <ToggleSubtitlesButton
                      isEnabled={Boolean(playerState.subtitleTrack)}
                    />
                  )}
                {playerState.isAirPlayAvailable && <AirPlayButton />}
                {/* @ts-ignore */}
                {isCastAvailable && <google-cast-launcher />}
                {playerCore.isPictureInPictureSupported() &&
                  options.allowPictureInPicture && <PictureInPictureButton />}
                <FullscreenButton
                  isFullscreen={playerCore.isFullscreen() ?? false}
                />
              </div>
              {playerState.isSeekable && (
                <Timeline
                  isAtLiveEdge={playerState.isAtLiveEdge}
                  isLive={playerState.isLive}
                  currentTime={playerState.currentTime}
                  seekable={playerState.seekable}
                  utcCurrentTime={playerState.utcCurrentTime}
                  utcSeekable={playerState.utcSeekable}
                  timelineSpriteCues={metadata.timelineSpriteCues}
                  showWallClock={showWallClock ?? false}
                  timeZone={options.timeZone}
                  adMarkerPositions={adMarkerPositions}
                />
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
