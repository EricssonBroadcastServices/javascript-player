// SPDX-FileCopyrightText: 2024 Red Bee Media Ltd <https://www.redbeemedia.com/>
//
// SPDX-License-Identifier: MIT

import { AdClip } from "@ericssonbroadcastservices/rbm-ott-sdk";

import { EmitterBaseClass } from "@ericssonbroadcastservices/js-player-shared";

import { StitcherEventMap } from "../utils/constants";

/**
 * The ads parser has one single responsibility: To detect ads and create IAdBlock objects and emit them.
 */
export abstract class AbstractAdsParser extends EmitterBaseClass<StitcherEventMap> {
  constructor(
    protected clips: AdClip[] = [],
    protected isLive: boolean = false
  ) {
    super();
  }

  public abstract init(): void;

  public isTimeUTC() {
    return this.isLive;
  }
}
