// SPDX-FileCopyrightText: 2024 Red Bee Media Ltd <https://www.redbeemedia.com/>
//
// SPDX-License-Identifier: MIT

import { MediaFormatType } from "@ericssonbroadcastservices/rbm-ott-sdk";

import {
  BasePlayerState,
  ContentType,
  CorePlayerEventsMap,
  DefaultPlayerEvent,
  DefaultPlayerState,
  EmitterBaseClass,
  PlayerEvents,
  Seekable,
  Track,
} from "@ericssonbroadcastservices/js-player-shared";

import { InstanceSettingsInterface } from "../utils/interfaces";

export interface IPlayerStreamInfo {
  mediaLocator: string;
  format: MediaFormatType;
  hasDrm: boolean;
}

export const INTERNAL_STATE_CHANGED = "PLAYER:INTERNAL_STATE_CHANGED";

type InternalPlayerEventMap = Omit<
  CorePlayerEventsMap,
  typeof PlayerEvents.STATE_CHANGED
> & {
  [INTERNAL_STATE_CHANGED]: BasePlayerState;
};

export abstract class AbstractPlayer extends EmitterBaseClass<InternalPlayerEventMap> {
  protected state: BasePlayerState = { ...DefaultPlayerState };
  protected mainContentType: ContentType;

  protected instanceSettings: InstanceSettingsInterface;

  constructor(
    instanceSettings: InstanceSettingsInterface,
    initialState: Partial<BasePlayerState> = {}
  ) {
    super();
    this.instanceSettings = instanceSettings;
    this.mainContentType = this.isLive() ? ContentType.LIVE : ContentType.VOD;
    const audioOnly = this.instanceSettings?.playResponse?.audioOnly;
    this.setState(
      Object.assign(
        {
          contentType: this.mainContentType,
          mediaType: audioOnly ? "audio" : "video",
        },
        initialState
      ),
      false
    );
  }

  protected getDefaultPlayerEvent(): DefaultPlayerEvent {
    return {
      currentTime: this.getCurrentTime(),
      duration: this.getDuration(),
      utcCurrentTime: this.getUTCCurrentTime(),
      utcDuration: this.getUTCDuration(),
      seekable: this.getSeekable(),
      utcSeekable: this.getUTCSeekable(),
    };
  }

  public isLive(): boolean {
    if (this.instanceSettings.mediaInfo?.isLive !== undefined) {
      return this.instanceSettings.mediaInfo.isLive;
    }
    return false;
  }

  protected setState(state: Partial<BasePlayerState>, emit = true): void {
    this.state = {
      ...this.state,
      ...state,
    };
    emit && this.emit(INTERNAL_STATE_CHANGED, this.state);
  }

  public getState(): BasePlayerState {
    return this.state;
  }

  abstract load(startTime: number): void;

  abstract getPlayerEngineName(): string | undefined;
  abstract getPlayerEngineVersion(): string | undefined;

  abstract getPlaybackFormat(): MediaFormatType | undefined;

  public abstract play(): void;
  public abstract pause(): void;
  public abstract stop(): void;
  public abstract scrub(change: number): void;
  public abstract seekTo(time: number): void;
  public abstract seekToLive(): void;
  public abstract setPlaybackRate(rate: number): void;
  public abstract isPlaying(): boolean;
  public abstract isSeekable(): boolean;

  public abstract getVolume(): number;
  public abstract setVolume({
    percentage,
    change,
  }: {
    percentage?: number;
    change?: number;
  }): void;

  public abstract setMuted(muted: boolean): void;
  public abstract toggleMuted(): void;

  public abstract setAudioTrack(track: Track): void;
  public abstract getAudioTrack(): Track | undefined;
  public abstract getAudioTracks(): Track[];
  public abstract setSubtitleTrack(track?: Track): void;
  public abstract getSubtitleTrack(): Track | undefined;
  public abstract getSubtitleTracks(): Track[];

  public abstract getCurrentTime(): number;
  public abstract getDuration(): number;
  public abstract getSeekable(): Seekable;

  public abstract getUTCCurrentTime(): number;
  public abstract getUTCDuration(): number;
  public abstract getUTCSeekable(): Seekable;

  public abstract clickThrough(): void;
  public abstract getStreamInfo(): IPlayerStreamInfo | undefined;
}
