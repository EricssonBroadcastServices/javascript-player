// SPDX-FileCopyrightText: 2024 Red Bee Media Ltd <https://www.redbeemedia.com/>
//
// SPDX-License-Identifier: MIT

export type ISkinOptions = {
  hideControlsTimer: number;
  showMetadata: boolean;
  showWallClock: boolean;
  showQualitySelector: boolean;
  showSubtitlesToggleButton: boolean;
  showJumpButtons: boolean;
  allowPictureInPicture: boolean;
  keyboardShortcuts: boolean;
  timeZone?: string;
  locale?: string;
  // TODO: Add a proper interface for translations
  translations?: any;
};

export type IPlayerSkinOptions = Partial<ISkinOptions>;

export const defaultOptions: ISkinOptions = {
  hideControlsTimer: 2500,
  showMetadata: true,
  showWallClock: false,
  showQualitySelector: true,
  showSubtitlesToggleButton: false,
  showJumpButtons: true,
  allowPictureInPicture: true,
  keyboardShortcuts: true,
};
