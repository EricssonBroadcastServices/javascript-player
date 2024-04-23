// SPDX-FileCopyrightText: 2024 Red Bee Media Ltd <https://www.redbeemedia.com/>
//
// SPDX-License-Identifier: MIT

import { ContractRestrictions } from "@ericssonbroadcastservices/rbm-ott-sdk";

export interface IClientRestrictions {
  timeshiftEnabled: boolean;
}

export class ContractRestrictionsGuardian {
  private currentPosition?: number;
  private clientRestrictions: IClientRestrictions;

  constructor(private contractRestrictions: ContractRestrictions = {}) {
    this.contractRestrictions = Object.assign(
      {
        timeshiftEnabled: true,
        ffEnabled: true,
        rwEnabled: true,
      },
      contractRestrictions
    );

    this.clientRestrictions = {
      timeshiftEnabled: true,
    };
  }

  setClientRestrictions(clientRestrictions: Partial<IClientRestrictions>) {
    this.clientRestrictions = {
      ...this.clientRestrictions,
      ...clientRestrictions,
    };
  }

  /**
   * This method looks into the set contract restrictions and
   * whether we define the size of the change to be a seek or a natural change during playback
   *
   * @param change Plus or Minus change in seconds from the latest noted valid position
   */
  private isSeekingAllowed(change: number): boolean {
    // Everything backward or forward less than one second is considered natural change
    const minorNaturalTimeChange =
      (change || change === 0) && change >= -1 && change <= 1;

    const timeshiftEnabled =
      this.contractRestrictions.timeshiftEnabled &&
      this.clientRestrictions.timeshiftEnabled;

    const scrubForwardAllowed =
      timeshiftEnabled && this.contractRestrictions?.ffEnabled;
    const scrubBackwardAllowed =
      timeshiftEnabled && this.contractRestrictions?.rwEnabled;

    if (minorNaturalTimeChange) return true;
    if (change > 0 && timeshiftEnabled && scrubForwardAllowed) return true;
    if (change < 0 && timeshiftEnabled && scrubBackwardAllowed) return true;
    const allowedScrub =
      change > 0
        ? !!scrubForwardAllowed
        : change < 0
        ? !!scrubBackwardAllowed
        : false;

    return allowedScrub;
  }

  /**
   * If the contract restrictions restricts scrubbing we won't allow what we define as a scrub
   * We therefore compare each new reported position with the latest noted valid position
   * We always return whether it's valid together with the latest noted valid position,
   * either updated to the new position or the old onee
   *
   * @param position The position to test
   */
  isValidPosition(
    position: number,
    force = false
  ): { valid: boolean; validPosition: number } {
    if (!this.currentPosition) {
      this.currentPosition = position;
      return { valid: true, validPosition: this.currentPosition };
    }
    const change = position - (this.currentPosition || 0);
    const isValid = this.isSeekingAllowed(change);
    if (!isValid && !force) {
      return { valid: false, validPosition: this.currentPosition };
    }
    this.currentPosition = position;
    return { valid: true, validPosition: this.currentPosition };
  }

  isAirPlayAllowed(): boolean {
    if (this.contractRestrictions?.airplayEnabled) return true;
    return false;
  }
}
