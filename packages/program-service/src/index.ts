// SPDX-FileCopyrightText: 2024 Red Bee Media Ltd <https://www.redbeemedia.com/>
//
// SPDX-License-Identifier: MIT

import {
  Asset,
  PlayResponse,
  ServiceContext,
  entitle,
  getChannelStatus,
  getEpgForChannel,
} from "@ericssonbroadcastservices/rbm-ott-sdk";

import {
  EmitterBaseClass,
  LiveAsset,
} from "@ericssonbroadcastservices/js-player-shared";

export const ProgramServiceEvent = {
  NEW_PROGRAMS: "new_programs",
  PROGRAM_CHANGED: "program_changed",
  NOT_ENTITLED: "not_entitled",
  BLACKOUT: "blackout",
  EMPTY_SLOT: "empty_slot",
} as const;
export type ProgramServiceEvent =
  (typeof ProgramServiceEvent)[keyof typeof ProgramServiceEvent];

type ProgramServiceEventMap = {
  [ProgramServiceEvent.NEW_PROGRAMS]: {
    programs: LiveAsset[];
  };
  [ProgramServiceEvent.PROGRAM_CHANGED]: {
    currentProgram?: LiveAsset;
    upcomingProgram?: LiveAsset;
  };
  [ProgramServiceEvent.NOT_ENTITLED]: LiveAsset;
  [ProgramServiceEvent.BLACKOUT]: LiveAsset;
  [ProgramServiceEvent.EMPTY_SLOT]: undefined;
};

export class ProgramService extends EmitterBaseClass<ProgramServiceEventMap> {
  private channelAssetId?: string;
  private epgEnabled = false;
  private pingState: "IDLE" | "REQUESTING" | "DISABLED" = "IDLE";
  private storedPrograms: LiveAsset[] = [];
  private watching?: LiveAsset;
  private context: ServiceContext;
  private sessionToken: string;
  private disabledTimeout?: number;
  private shouldCheckEntitlement = false;
  // Spread pre-entitlement requests within 2 minutes from start time
  private preEntitleTreshold = 2 * 60 * 1000 * Math.random();
  private preEntitlementRequests = new WeakMap<LiveAsset, Promise<boolean>>();

  constructor({
    asset,
    play,
    baseUrl,
    customer,
    businessUnit,
    sessionToken,
  }: {
    asset: Asset;
    play: PlayResponse;
    baseUrl: string;
    customer: string;
    businessUnit: string;
    sessionToken: string;
  }) {
    super();

    this.context = {
      customer,
      businessUnit,
      baseUrl,
    };
    this.sessionToken = sessionToken;

    // If we're playing a channel, use that ID - otherwise find the program's channel
    const channelAssetId =
      asset.type === "TV_CHANNEL" ? asset.assetId : play.streamInfo?.channelId;

    if (!channelAssetId) return;

    this.channelAssetId = channelAssetId;

    this.epgEnabled = !!play.epg?.enabled;

    this.shouldCheckEntitlement = Boolean(play.epg?.entitlementCheck);
  }

  private setPingStateIfProgramEnded(currentTime: number) {
    const endTime = this.watching && new Date(this.watching.endTime).getTime();
    const isProgramEnded = endTime && currentTime >= endTime;

    if (this.isSingleEventChannel() && isProgramEnded) {
      this.pingState = "IDLE";
    }
  }

  public async ping(currentTime: number): Promise<void> {
    // Set this.pingState to "IDLE" if this channel has one single program and currentTime is equal to or greater than this.watching.endTime
    this.setPingStateIfProgramEnded(currentTime);

    if (
      ["DISABLED", "REQUESTING"].includes(this.pingState) ||
      currentTime === -1
    ) {
      return;
    }

    const position = this.epgEnabled ? currentTime : undefined;

    // Check against the stored data
    let currentProgram = this.getCurrentProgram(position);
    let upcomingProgram = this.getUpcomingProgram(position);

    // Check if we should pre-entitle
    if (
      this.shouldCheckEntitlement &&
      upcomingProgram &&
      position &&
      !this.preEntitlementRequests.has(upcomingProgram) &&
      this.preEntitleTreshold >
        new Date(upcomingProgram.startTime).getTime() - position
    ) {
      this.preEntitlementRequests.set(
        upcomingProgram,
        this.isEntitled(upcomingProgram)
      );
    }

    if (
      this.watching?.startTime &&
      this.watching.startTime === currentProgram?.startTime
    ) {
      return;
    }

    this.pingState = "REQUESTING";

    // update the stored data if there is no current or upcoming program
    if (!currentProgram || !upcomingProgram) {
      await this.updatePrograms();
      currentProgram = this.getCurrentProgram(position);
      upcomingProgram = this.getUpcomingProgram(position);
    }

    // If currentProgram exist and this channel has one single program, set this.pingState to "DISABLED" and call this.handleProgramChanged
    if (currentProgram && this.isSingleEventChannel()) {
      this.pingState = "DISABLED";
      await this.handleProgramChanged(currentProgram, upcomingProgram);
      return;
    }

    // If there's still no programs, disable the ProgramService for 30s
    // Report no current program, i.e. only channel will be reported from the player
    if (!currentProgram) {
      this.handleNoProgram();

      this.pingState = "DISABLED";
      this.disabledTimeout = window.setTimeout(() => {
        this.pingState = "IDLE";
      }, 30000);
    } else {
      await this.handleProgramChanged(currentProgram, upcomingProgram);
      this.pingState = "IDLE";
    }
  }

  private isSingleEventChannel() {
    return this.epgEnabled && this.storedPrograms.length === 1;
  }

  private handleNoProgram() {
    // If we've are watching something that has data, but suddenly get a lack of data
    if (this.epgEnabled && this.watching) {
      this.emit(ProgramServiceEvent.EMPTY_SLOT, undefined);
    }
    this.emit(ProgramServiceEvent.PROGRAM_CHANGED, {
      currentProgram: undefined,
      upcomingProgram: undefined,
    });

    this.watching = undefined;
  }

  private async handleProgramChanged(
    currentProgram: LiveAsset,
    upcomingProgram?: LiveAsset
  ): Promise<void> {
    if (!currentProgram) {
      return this.handleNoProgram();
    }
    this.watching = currentProgram;

    if ("blackout" in currentProgram && currentProgram.blackout) {
      this.emit(ProgramServiceEvent.BLACKOUT, currentProgram);
    } else if (await this.isEntitled(currentProgram)) {
      this.emit(ProgramServiceEvent.PROGRAM_CHANGED, {
        currentProgram,
        upcomingProgram,
      });
    } else {
      console.warn(
        "User is not entitled to the current program",
        currentProgram
      );
      this.emit(ProgramServiceEvent.NOT_ENTITLED, currentProgram);
    }
  }

  private getCurrentProgram(position?: number): LiveAsset | undefined {
    const now = position || new Date().getTime();
    return this.storedPrograms.find(
      (program) =>
        new Date(program.startTime).getTime() < now &&
        new Date(program.endTime).getTime() > now
    );
  }

  private getUpcomingProgram(position?: number): LiveAsset | undefined {
    const now = position || new Date().getTime();
    return this.storedPrograms.find(
      (program) => new Date(program.startTime).getTime() > now
    );
  }

  private async updatePrograms(): Promise<void> {
    const programs = await this.getPrograms();

    if (programs.length === 0) {
      return;
    }
    programs.sort(
      (a, b) =>
        new Date(a.startTime).getTime() - new Date(b.startTime).getTime()
    );
    this.storedPrograms = programs;
    this.emit(ProgramServiceEvent.NEW_PROGRAMS, { programs });
  }

  private async isEntitled(program: LiveAsset): Promise<boolean> {
    if (!this.shouldCheckEntitlement) {
      return true;
    }

    const preEntitlementCheck = this.preEntitlementRequests.get(program);
    if (preEntitlementCheck) {
      const status = await preEntitlementCheck;
      this.preEntitlementRequests.delete(program);
      return status;
    }

    // For channels without epg we check entitlement on channel level
    // For channels with epg we check entitlement on program level
    const assetId = this.epgEnabled
      ? program.asset?.assetId
      : this.channelAssetId;

    if (!assetId) {
      return false;
    }

    const time = new Date(
      Math.max(
        new Date().getTime(),
        // For pre-entitlements we need to add one millisecond, because startTime is often publication time,
        // and the request fails unless time is after publication time
        new Date(program.startTime).getTime() + 1
      )
    ).toISOString();

    try {
      const headers = { Authorization: `Bearer ${this.sessionToken}` };
      await entitle.call(this.context, { assetId, time, headers });
      return true;
    } catch {
      return false;
    }
  }

  private async getPrograms(): Promise<LiveAsset[]> {
    if (!this.channelAssetId) {
      console.warn(
        "[ProgramService] Failed to get programs, no channel assetId found"
      );
      return [];
    }

    try {
      if (this.epgEnabled && this.channelAssetId) {
        return (
          await getEpgForChannel.call(this.context, {
            channelId: this.channelAssetId,
            date: new Date(),
            daysForward: 0,
            daysBackward: 0,
            pageSize: 500,
            pageNumber: 1,
          })
        ).programs;
      }
      // for channels without an epg configured, we fallback to the channel status (a.k.a. "on now") endpoint.
      // This only gets a few programs per request, so we append them to the storedPrograms
      const { assets = [] } = await getChannelStatus.call(this.context, {
        channelId: this.channelAssetId,
        minutesForward: 100,
      });
      const storedStartTimes = this.storedPrograms.map((p) => p.startTime);
      const nextPrograms = assets.filter(
        (p) => !storedStartTimes.includes(p.startTime)
      );
      return [...this.storedPrograms, ...nextPrograms];
    } catch (e) {
      console.warn("[ProgramService] Failed to get programs", e);
      return [];
    }
  }

  public destroy() {
    super.destroy();
    clearTimeout(this.disabledTimeout);
  }
}
