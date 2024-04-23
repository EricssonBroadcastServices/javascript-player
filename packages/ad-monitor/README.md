<!--
SPDX-FileCopyrightText: 2024 Red Bee Media Ltd <https://www.redbeemedia.com/>

SPDX-License-Identifier: CC-BY-SA-4.0
-->

# Ad Monitor

Module for tracking the playback of SSAI streams.

## Usage

```javascript
import { AdMonitor, AdMonitorEvent } from "@ericssonbroadcastservices/js-player-ad-monitor";

const adMonitor = new AdMonitor(adStitchProvider);
adMonitor.init(this.videoElement, mediaLocator, vastUrl);

adMonitor.on(AdMonitorEvent.AD_START, (data) => {
  // ad starts to play
});
adMonitor.on(AdMonitorEvent.AD_END, () => {
  // ad ends to play
});
```
