<!--
SPDX-FileCopyrightText: 2024 Red Bee Media Ltd <https://www.redbeemedia.com/>

SPDX-License-Identifier: CC-BY-SA-4.0
-->

# @ericssonbroadcastservices/js-player-analytics

Analytics module for the JS Player.

## Device Information

### Chromecast

The different Chromecast devices will be determined via the cast receiver instance `canDisplayType`, `hardwareConcurrency` or `userAgent`.

* Chromecast generation 1 and 2 will have `hardwareConcurrency` of 1 and 2 respectively.
* Chromecast generation 3 supports 'HEVC main profile, level 3.1' which means that `canDisplayType('video/mp4; codecs=avc1.64002A')` will return 'true'.
* Chromecast Ultra supports 'HEVC main profile, level 3.1' which means that `canDisplayType('video/mp4; codecs=hev1.1.6.L93.B0')` will return 'true'.
* Android devices with built in Chromecast will have a `userAgent` that includes 'Android'.
* Chromecast with Google TV supports 'H.264 High Profile, level 5.1' which means that `canDisplayType('video/mp4; codecs="avc1.640033')` will return 'true'.
* If no of the above conditions are met, the device will be defined simply as a generic Chromecast device.

The different Chromecast models are defined as follows:

```typescript
export type castModel =
  | "CHROMECAST_WITH_GOOGLE_TV"
  | "CHROMECAST_ANDROID"
  | "CHROMECAST_ULTRA"
  | "CHROMECAST_GEN_3"
  | "CHROMECAST_GEN_2"
  | "CHROMECAST_GEN_1"
  | "CHROMECAST";
```
