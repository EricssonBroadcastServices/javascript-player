<!--
SPDX-FileCopyrightText: 2024 Red Bee Media Ltd <https://www.redbeemedia.com/>

SPDX-License-Identifier: CC-BY-SA-4.0
-->

# RedBee Skin

## Usage

```js
new RedBeeSkin(playerInstance, settings);
```

available settings

```typescript
export interface IPlayerSkinOptions {
  hideControlsTimer?: number;
  showMetadata?: boolean;
  showWallClock?: boolean;
  showSubtitlesToggleButton?: boolean;
  showQualitySelector?: boolean;
  showJumpButtons?: boolean;
  allowPictureInPicture?: boolean;
  keyboardShortcuts?: boolean;
  timeZone?: string;
}
```
