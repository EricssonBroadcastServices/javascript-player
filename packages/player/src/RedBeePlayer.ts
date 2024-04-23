// SPDX-FileCopyrightText: 2024 Red Bee Media Ltd <https://www.redbeemedia.com/>
//
// SPDX-License-Identifier: MIT

import "@ericssonbroadcastservices/js-player-skin/dist/index.css";

import type {
  Asset,
  ContractRestrictions,
} from "@ericssonbroadcastservices/rbm-ott-sdk";
import { ISpriteCue } from "@ericssonbroadcastservices/sprite-vtt-parser";

import { PlayerCoreConnector } from "@ericssonbroadcastservices/js-player-analytics";
import { CastSender } from "@ericssonbroadcastservices/js-player-cast-sender";
import {
  ExposureService,
  ILoadOptions,
  IPlayerCoreOptions,
  PlayerCore,
} from "@ericssonbroadcastservices/js-player-core";
import {
  BasePlayerState,
  CastSenderEvent,
  Controller,
  EmitterBaseClass,
  ErrorTypes,
  InitError,
  PlaybackState,
  PlayerEvents,
  PlayerEventsMap,
  PlayerState,
  QualityLevel,
  Seekable,
  TAppType,
  Track,
} from "@ericssonbroadcastservices/js-player-shared";
import {
  IPlayerSkinOptions,
  RedBeeSkin,
} from "@ericssonbroadcastservices/js-player-skin";

export interface IRedBeePlayerOptions extends IPlayerCoreOptions {
  // overide these three w non-optionals
  customer: string;
  businessUnit: string;
  exposureBaseUrl: string;
  username?: string;
  password?: string;
  debug?: boolean;
  castAppId?: string;
  disableCast?: boolean;
}

export interface IRedBeePlayerSkinOptions extends IPlayerSkinOptions {
  disabled?: boolean;
  onSkinHidden?: () => void;
  onSkinVisible?: () => void;
}

export interface IRedBeePlayerAnalyticsOptions {
  disabled?: boolean;
  baseUrl?: string;
  appName?: string;
}

type Module = PlayerCoreConnector | RedBeeSkin;

export class RedBeePlayer extends EmitterBaseClass<PlayerEventsMap> {
  private destroyed = false;

  private readonly playerOptions: IRedBeePlayerOptions;
  private readonly analyticsOptions?: IRedBeePlayerAnalyticsOptions;

  private sessionToken?: string;

  private preloadPromise: Promise<any> | undefined;

  private playlist: ILoadOptions[] = [];
  private loadedItem?: ILoadOptions;

  private skin?: RedBeeSkin;

  private core?: PlayerCore;
  private castSender?: CastSender;
  private modules: Module[] = [];

  constructor({
    player,
    analytics,
    skin,
  }: {
    player: IRedBeePlayerOptions;
    skin?: IRedBeePlayerSkinOptions;
    analytics?: IRedBeePlayerAnalyticsOptions;
  }) {
    super();
    // Omit the auth details from what we store in the instance
    const { username, password, sessionToken, ...playerOptions } = player;
    const { customer, businessUnit, exposureBaseUrl: baseUrl } = playerOptions;

    this.playerOptions = playerOptions;
    this.analyticsOptions = analytics;
    const ctx = { customer, businessUnit, baseUrl };
    const authOptions =
      username && password ? { username, password } : undefined;

    if (sessionToken) {
      this.sessionToken = sessionToken;
    } else {
      this.preloadPromise = new ExposureService(ctx)
        .authenticate(authOptions)
        .then(({ sessionToken }) => {
          this.sessionToken = sessionToken;
          this.emit(PlayerEvents.SESSION_ACQUIRED, undefined);
        });
    }

    if (!skin?.disabled) {
      const { onSkinHidden, onSkinVisible, ...skinOptions } = skin ?? {};
      this.skin = new RedBeeSkin(
        this.playerOptions.wrapperElement,
        skinOptions,
        {
          onSkinHidden,
          onSkinVisible,
        }
      );
      this.skin.render();
    }

    if (!player.disableCast) {
      this.setupCastSender();
    }

    this.setupEventListeners();
  }

  private setupEventListeners() {
    let ended = false;
    // Check if STATE_CHANGED has gone to ended, we check the state instead of listening
    // to the ENDED event because when casting only STATE_CHANGED is emitted.
    this.on(PlayerEvents.STATE_CHANGED, ({ playbackState }) => {
      if (playbackState === PlaybackState.ENDED && !ended) {
        ended = true;
        if (this.playlist.length > 1) {
          this.playlist.shift();
          this.load(this.playlist);
        }
      } else {
        ended = false;
      }
    });
  }

  private async setupPlayer() {
    const promises: Promise<any>[] = [];

    this.setupPlayerCore();

    if (!this.analyticsOptions?.disabled) {
      promises.push(this.setupPlayerAnalytics());
    }

    // It's critical this is added _last_ to make sure that the modules ☝️
    // is allowed to react to the event before anything else.
    this.core?.onAll(({ event, data }) => {
      if (event === PlayerEvents.STATE_CHANGED) {
        this.emit(event, {
          isCasting: false,
          isCastAvailable: !!this.castSender?.isAvailable(),
          ...data,
        });
      } else {
        this.emit(event, data);
      }
    });
    await Promise.allSettled(promises);
  }

  private setupPlayerCore() {
    if (this.sessionToken) {
      this.core = new PlayerCore({
        ...this.playerOptions,
        sessionToken: this.sessionToken,
      });
      this.skin?.render(this.core, this.castSender);
    }
  }

  private async setupPlayerAnalytics() {
    if (this.core && this.sessionToken) {
      const { customer, businessUnit, debug } = this.playerOptions;

      // TODO: this should be moved to the PlayerCoreConnector, requires some refactoring of analytics.
      const { model, modelNumber, manufacturer, type, os, osVersion } =
        await this.core.getDevice();

      let appType: TAppType = "browser";
      if (type === "ctv") {
        switch (manufacturer) {
          case "samsung":
            appType = "samsung_tv";
            break;
          case "lg":
            appType = "lg_tv";
        }
      }

      const analytics = new PlayerCoreConnector({
        customer,
        businessUnit,
        analyticsBaseUrl:
          this.analyticsOptions?.baseUrl ?? this.playerOptions.exposureBaseUrl,
        sessionToken: this.sessionToken,
        debug,
        device: {
          model,
          modelNumber,
          manufacturer,
          appType,
          appName: this.analyticsOptions?.appName,
          os,
          osVersion,
        },
      });

      analytics.connect(this.core);

      this.modules.push(analytics);
    }
  }

  private setupCastSender() {
    if (this.castSender) {
      return;
    }

    this.castSender = new CastSender({
      castAppId: this.playerOptions.castAppId,
      logLevel: this.playerOptions.logLevel,
    });

    this.castSender.on(CastSenderEvent.AVAILABILITY_CHANGED, () => {
      const state = this.getState();
      if (state) {
        this.emit(PlayerEvents.STATE_CHANGED, state);
      }
    });

    this.castSender.on(CastSenderEvent.ERROR, (error) =>
      this.emit(PlayerEvents.CAST_ERROR, error)
    );

    this.castSender.on(CastSenderEvent.STATE_CHANGE, (state) => {
      if (!this.core) {
        this.emit(PlayerEvents.STATE_CHANGED, {
          isCasting: true,
          isCastAvailable: true,
          isAirPlaying: false,
          isAirPlayAvailable: false,
          ...state,
        });
      }
    });

    this.castSender.on(CastSenderEvent.CONNECTED, () => {
      if (this.core && this.loadedItem) {
        const audioLanguage = this.core.getAudioTrack()?.language;
        const subtitleLanguage = this.core.getSubtitleTrack()?.language;

        let startTime = this.core.getCurrentTime();
        const seekable = this.core.getSeekable();
        if (startTime && seekable?.start) {
          // chromecast start time is always 0 based so we remove the start offset
          // https://developers.google.com/cast/docs/reference/web_sender/chrome.cast.media.LoadRequest?hl=en#currentTime
          startTime -= seekable.start;
        }

        this._loadCastSender(
          {
            ...this.loadedItem,
            startTime,
          },
          {
            audioLanguage,
            subtitleLanguage,
          }
        );
      }

      this.emit(PlayerEvents.CAST_START, {
        currentTime: this.core?.getCurrentTime(),
      });
      this.destroyPlayer();
    });

    this.castSender.on(CastSenderEvent.DISCONNECTED, () => {
      const state: BasePlayerState | undefined = this.castSender?.getState();
      const isLive: boolean | undefined = this.castSender?.isLive();
      this.emit(PlayerEvents.CAST_STOP, {
        currentTime: state?.currentTime,
      });
      const castAssetId = this.castSender?.getContentId();

      const loadOptions =
        castAssetId && castAssetId !== this.loadedItem?.source
          ? { source: castAssetId }
          : this.loadedItem;

      if (loadOptions) {
        this.load({
          ...loadOptions,
          startTime: isLive ? undefined : state?.currentTime,
        });

        // if we are playing live content castCurrentTime will be seconds from seekable.start which differs
        // from how the core works where live time usually is in the UTC format.
        // So instead of passing in startTime we seek to the correct time after the player has loaded.
        this.once(PlayerEvents.LOADED, () => {
          if (isLive && state?.currentTime) {
            const seekToTime =
              (this.core?.getSeekable()?.start ?? 0) + state?.currentTime;
            this.core?.seekTo(seekToTime);
          }

          if (state?.audioTrack) {
            const coreAudioTrack = this.core
              ?.getAudioTracks()
              .find((track) => track.language === state.audioTrack?.language);
            if (coreAudioTrack) {
              this.core?.setAudioTrack(coreAudioTrack);
            }
          }

          if (state?.subtitleTrack) {
            const coreSubtitleTrack = this.core
              ?.getSubtitleTracks()
              .find(
                (track) => track.language === state.subtitleTrack?.language
              );
            if (coreSubtitleTrack) {
              this.core?.setSubtitleTrack(coreSubtitleTrack);
            }
          }
        });
      }
    });
    this.skin?.render(this.core, this.castSender);
  }

  private _loadCastSender(
    loadOptions: ILoadOptions,
    {
      audioLanguage,
      subtitleLanguage,
    }: {
      audioLanguage?: string;
      subtitleLanguage?: string;
    } = {}
  ) {
    this.castSender?.load({
      source: loadOptions.source,
      audioLanguage,
      subtitleLanguage,
      customer: this.playerOptions.customer,
      businessUnit: this.playerOptions.businessUnit,
      sessionToken: this.sessionToken ?? "",
      adobePrimetimeToken: this.playerOptions.adobePrimetimeToken,
      locale: this.playerOptions.locale ?? "en",
      exposureBaseUrl: this.playerOptions.exposureBaseUrl,
      adParameters: loadOptions.ads,
      startTime: loadOptions.startTime,
    });
  }

  private async _loadPlayerCore(loadOptions: ILoadOptions): Promise<void> {
    if (this.destroyed) {
      throw "[RedBeePlayer] cannot load on a destroyed instance of the player, please create a new instance";
    }
    this.destroyPlayer();
    await this.preloadPromise;
    await this.setupPlayer();

    this.loadedItem = loadOptions;

    return this.core?.load(loadOptions);
  }

  public load(source: ILoadOptions | string | ILoadOptions[] | string[]): void {
    const playlist = (Array.isArray(source) ? source : [source]).map((source) =>
      typeof source === "string" ? { source } : source
    );
    const [nextItem] = playlist;
    if (!nextItem || !playlist.every(({ source }) => source)) {
      throw new InitError("The load method requires a source argument", {
        type: ErrorTypes.OPTIONS,
      });
    }
    this.playlist = playlist;

    if (this.castSender?.isConnected()) {
      if (nextItem.source !== this.castSender.getContentId()) {
        this._loadCastSender(nextItem);
      }
    } else {
      this._loadPlayerCore(nextItem);
    }
  }

  public isBrowserSupported() {
    return PlayerCore.isBrowserSupported();
  }

  private destroyPlayer() {
    this.skin?.render(undefined, this.castSender);

    this.core?.destroy();
    this.core = undefined;

    if (this.modules.length) {
      this.modules.forEach((module) => module.destroy());
      this.modules = [];
    }
  }

  public destroy({ retainCastSession }: { retainCastSession?: boolean } = {}) {
    this.destroyPlayer();

    this.skin?.destroy();
    this.castSender?.destroy({ retainCastSession });
    super.destroy();

    this.destroyed = true;
  }

  private getController(): Controller | undefined {
    return this.core || this.castSender;
  }

  // These are direct accessors of the PlayerCore methods, any new method
  // should be added below. NOTE! These methods should contain _no_ logic
  public getPlayerInfo() {
    if (!this.core && this.castSender?.isConnected()) {
      console.warn(
        "[RedBeePlayer] getPlayerInfo() is not available when casting"
      );
    }
    return this.core?.getPlayerInfo();
  }

  public getSession() {
    if (!this.core && this.castSender?.isConnected()) {
      console.warn("[RedBeePlayer] getSession() is not available when casting");
    }
    return this.core?.getSession();
  }

  public getAssetInfo(): Asset | undefined {
    if (!this.core && this.castSender?.isConnected()) {
      console.warn(
        "[RedBeePlayer] getAssetInfo() is not available when casting, if you need the assetId use getAssetId() instead"
      );
    }
    return this.core?.getAssetInfo();
  }

  public getProgramInfo() {
    if (!this.core && this.castSender?.isConnected()) {
      console.warn(
        "[RedBeePlayer] getProgramInfo() is not available when casting"
      );
    }
    return this.core?.getProgramInfo();
  }

  public getContractRestrictions(): ContractRestrictions | undefined {
    if (!this.core && this.castSender?.isConnected()) {
      console.warn(
        "[RedBeePlayer] getContractRestrictions() is not available when casting"
      );
    }
    return this.core?.getContractRestrictions();
  }

  public getContainerElement() {
    if (!this.core && this.castSender?.isConnected()) {
      console.warn(
        "[RedBeePlayer] getContainerElement() is not available when casting"
      );
    }
    return this.core?.getContainerElement();
  }

  public getVideoElement() {
    if (!this.core && this.castSender?.isConnected()) {
      console.warn(
        "[RedBeePlayer] getVideoElement() is not available when casting"
      );
    }
    return this.core?.getVideoElement();
  }

  public getTimelineSpriteCues(width?: number): Promise<ISpriteCue[]> {
    if (!this.core && this.castSender?.isConnected()) {
      console.warn(
        "[RedBeePlayer] getTimelineSpriteCues() is not available when casting"
      );
    }
    return this.core?.getTimelineSpriteCues(width) ?? Promise.resolve([]);
  }

  public isFullscreen() {
    if (!this.core && this.castSender?.isConnected()) {
      console.warn(
        "[RedBeePlayer] isFullscreen() is not available when casting"
      );
    }
    return this.core?.isFullscreen();
  }

  public toggleFullscreen() {
    if (!this.core && this.castSender?.isConnected()) {
      console.warn(
        "[RedBeePlayer] toggleFullscreen() is not available when casting"
      );
    }
    return this.core?.toggleFullscreen();
  }

  /**
   * returns true if the browser supports PictureInPicture
   */
  public isPictureInPictureSupported() {
    return PlayerCore.isPictureInPictureSupported();
  }

  /**
   * returns true if the currently playing content supports PictureInPicture
   */
  public isPictureInPictureAvailable() {
    if (!this.core && this.castSender?.isConnected()) {
      console.warn(
        "[RedBeePlayer] isPictureInPictureAvailable() is not available when casting"
      );
    }
    return this.core?.isPictureInPictureAvailable() ?? false;
  }

  /**
   * returns true if the player is currently in PictureInPicture mode
   */
  public isPictureInPicture() {
    if (!this.core && this.castSender?.isConnected()) {
      console.warn(
        "[RedBeePlayer] isPictureInPicture() is not available when casting"
      );
    }
    return this.core?.isPictureInPicture() ?? false;
  }

  public togglePictureInPicture() {
    if (!this.core && this.castSender?.isConnected()) {
      console.warn(
        "[RedBeePlayer] togglePictureInPicture() is not available when casting"
      );
    }
    this.core?.togglePictureInPicture();
  }

  public isAirplaySupported() {
    if (!this.core && this.castSender?.isConnected()) {
      console.warn(
        "[RedBeePlayer] isAirplaySupported() is not available when casting"
      );
    }
    return this.core?.isAirplaySupported();
  }

  public isAirplaying() {
    if (!this.core && this.castSender?.isConnected()) {
      console.warn(
        "[RedBeePlayer] isAirplaying() is not available when casting"
      );
    }
    return this.core?.isAirplaying() ?? false;
  }

  public toggleAirPlay() {
    if (!this.core && this.castSender?.isConnected()) {
      console.warn(
        "[RedBeePlayer] toggleAirPlay() is not available when casting"
      );
    }
    return this.core?.toggleAirPlay();
  }

  public getStreamInfo() {
    if (!this.core && this.castSender?.isConnected()) {
      console.warn(
        "[RedBeePlayer] getStreamInfo() is not available when casting"
      );
    }
    return this.core?.getStreamInfo();
  }

  public setPlaybackRate(rate: number): void {
    if (!this.core && this.castSender?.isConnected()) {
      console.warn(
        "[RedBeePlayer] setPlaybackRate() is not available when casting"
      );
    }
    this.core?.setPlaybackRate(rate);
  }

  public seekToUTC(utcTime: number) {
    if (!this.core && this.castSender?.isConnected()) {
      console.warn("[RedBeePlayer] seekToUTC() is not available when casting");
    }
    return this.core?.seekToUTC(utcTime);
  }

  // These are direct accessors of the PlayerCore/CastSender methods, any new method
  // should be added below. NOTE! These methods should contain _no_ logic

  public getAssetId() {
    if (this.core) {
      return this.core.getAssetInfo()?.assetId;
    }
    if (this.castSender) {
      return this.castSender.getContentId();
    }
  }

  public getState(): PlayerState | undefined {
    if (this.core) {
      return {
        ...this.core.getState(),
        isCasting: false,
        isCastAvailable: !!this.castSender?.isAvailable(),
      };
    } else if (this.castSender) {
      return {
        ...this.castSender.getState(),
        isAirPlaying: false,
        isAirPlayAvailable: false,
        isCasting: this.castSender.isConnected(),
        isCastAvailable: this.castSender.isAvailable(),
      };
    }
  }

  public getCurrentTime() {
    return this.getController()?.getCurrentTime();
  }

  public getVolume() {
    return this.getController()?.getVolume();
  }

  public play() {
    return this.getController()?.play();
  }

  public getSeekable(): Seekable | undefined {
    return this.getController()?.getSeekable();
  }

  public pause() {
    return this.getController()?.pause();
  }

  public setMuted(muted: boolean) {
    return this.getController()?.setMuted(muted);
  }

  public toggleMuted() {
    return this.getController()?.toggleMuted();
  }

  public seekTo({ time, change }: { time?: number; change?: number }) {
    if (typeof time === "number") {
      this.getController()?.seekTo(time);
    } else if (change) {
      this.getController()?.scrub(change);
    }
  }

  public seekToOffset(offset: number) {
    return this.getController()?.scrub(offset);
  }

  public seekToLive() {
    return this.getController()?.seekToLive();
  }

  public setQualityLevel(level: QualityLevel) {
    return this.getController()?.setQualityLevel(level);
  }

  public getQualityLevels() {
    return this.getController()?.getQualityLevels();
  }

  public setAudioTrack(track: Track) {
    return this.getController()?.setAudioTrack(track);
  }

  public setSubtitleTrack(track?: Track) {
    return this.getController()?.setSubtitleTrack(track);
  }

  public setVolume({ percentage }: { percentage: number }) {
    return this.getController()?.setVolume({ percentage });
  }

  public getAudioTrack() {
    return this.getController()?.getAudioTrack();
  }

  public getAudioTracks() {
    return this.getController()?.getAudioTracks();
  }

  public getSubtitleTrack() {
    return this.getController()?.getSubtitleTrack();
  }

  public getSubtitleTracks() {
    return this.getController()?.getSubtitleTracks();
  }

  public isLive() {
    return this.getController()?.isLive();
  }

  public isPlaying() {
    return this.getController()?.isPlaying();
  }

  public isVolumeReadOnly() {
    return this.getController()?.isVolumeReadOnly();
  }
}
