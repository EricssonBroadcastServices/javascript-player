// SPDX-FileCopyrightText: 2024 Red Bee Media Ltd <https://www.redbeemedia.com/>
//
// SPDX-License-Identifier: MIT

import {
  Asset,
  ContractRestrictions,
  MediaFormat,
  PlayResponse,
} from "@ericssonbroadcastservices/rbm-ott-sdk";
import {
  ISpriteCue,
  getTimelineSpriteCues,
} from "@ericssonbroadcastservices/sprite-vtt-parser";
import throttle from "lodash.throttle";

import {
  ProgramService,
  ProgramServiceEvent,
} from "@ericssonbroadcastservices/js-player-program-service";
import {
  Controller,
  CorePlayerEventsMap,
  CorePlayerState,
  DefaultPlayerState,
  EmitterBaseClass,
  ErrorTypes,
  IMediaInfo,
  InitError,
  LiveAsset,
  LogLevel,
  PlaybackState,
  PlayerEvents,
  QualityLevel,
  Track,
} from "@ericssonbroadcastservices/js-player-shared";

import { AirPlay, AirPlayEvent } from "./airplay/AirPlay";
import { getDevice } from "./device";
import { isBrowserSupported } from "./device/common";
import { TDeviceAdapter } from "./device/interfaces";
import {
  INTERNAL_STATE_CHANGED,
  IPlayerStreamInfo,
} from "./players/AbstractPlayer";
import { AdInsertionPlayer } from "./players/AdInsertionPlayer";
import { AssetPlayer } from "./players/AssetPlayer";
import { BasePlayer } from "./players/BasePlayer";
import { LowLatencyPlayer } from "./players/LowLatencyPlayer";
import { ExposureService } from "./services/ExposureService";
import { enrichAdsOptions } from "./utils/adsOptionsHelper";
import { getStartTime } from "./utils/data";
import { PLAYER_OPTIONS } from "./utils/defaults";
import { setupVideoElement } from "./utils/dom";
import { FullscreenManager } from "./utils/FullscreenManager";
import {
  getSupportedDrm,
  getSupportedFormats,
  isAutoplaySupported,
  isVolumeReadOnly,
} from "./utils/helpers";
import {
  ILoadOptions,
  IPlayerCoreOptions,
  IPlayerSession,
  InstanceSettingsInterface,
} from "./utils/interfaces";
import { info, setLogLevel } from "./utils/logger";
import { MediaSessionManager } from "./utils/MediaSessionManager";
import { PictureInPictureManager } from "./utils/PictureInPictureManager";

export type { ILoadOptions } from "./utils/interfaces";

export type { TDeviceAdapter } from "./device/interfaces";

const EXTERNAL_PREFIX = "external:";

const ClassNames = {
  CONTAINER: "redbee-player-container",
  MEDIA_CONTAINER: "redbee-player-media-container",
  SUBTITLE_CONTAINER: "redbee-player-subtitle-container",
};

export class PlayerCore
  extends EmitterBaseClass<CorePlayerEventsMap>
  implements Controller
{
  private player?: BasePlayer;
  private airPlay?: AirPlay;

  private instanceSettings: InstanceSettingsInterface;
  private exposureService?: ExposureService;
  private exposureBaseUrl?: string;
  private programService?: ProgramService;

  private videoElement: HTMLVideoElement;
  private mediaContainer: HTMLDivElement;
  private subtitleContainer: HTMLDivElement;
  private container: HTMLDivElement;
  private pipManager: PictureInPictureManager;

  private fullscreenManager?: FullscreenManager;

  private autoplay?: boolean;

  private spriteCueCache: { [url: string]: Promise<ISpriteCue[]> } = {};

  private destroyed = false;
  private state: CorePlayerState = {
    ...DefaultPlayerState,
    isAirPlaying: false,
    isAirPlayAvailable: false,
  };

  private subtitleSizeSet = false;
  private throttledUpdateSubtitleSize?: () => void;

  private deviceAdapter?: TDeviceAdapter;

  constructor(options: IPlayerCoreOptions) {
    super();
    setLogLevel(options.logLevel ?? LogLevel.NONE);

    this.deviceAdapter = options.deviceAdapter;

    // Setup DOM
    const { wrapperElement, fullscreenElement } = options;

    const container = document.createElement("div");
    container.className = ClassNames.CONTAINER;
    container.tabIndex = 0;

    const mediaContainer = document.createElement("div");
    mediaContainer.className = ClassNames.MEDIA_CONTAINER;
    container.appendChild(mediaContainer);

    this.videoElement = setupVideoElement();
    mediaContainer.appendChild(this.videoElement);

    this.subtitleContainer = document.createElement("div");
    this.subtitleContainer.className = ClassNames.SUBTITLE_CONTAINER;
    mediaContainer.appendChild(this.subtitleContainer);

    this.mediaContainer = mediaContainer;
    this.container = container;
    this.instanceSettings = {
      playerSDKVersion:
        typeof process.env.npm_package_version !== "undefined"
          ? process.env.npm_package_version
          : "dev-build",
      initOptions: {
        ...PLAYER_OPTIONS,
        ...options,
        mediaContainer,
      },
      isAsset: false,
    };

    if (wrapperElement) {
      wrapperElement.insertBefore(this.container, wrapperElement.firstChild);

      const _fullscreenElement =
        (fullscreenElement && document.querySelector(fullscreenElement)) ||
        wrapperElement;

      if (_fullscreenElement) {
        this.fullscreenManager = new FullscreenManager(
          _fullscreenElement,
          this.videoElement
        );
      }
    }
    this.pipManager = new PictureInPictureManager(this.videoElement);

    this.updateSubtitleSize();
    window.addEventListener(
      "resize",
      (this.throttledUpdateSubtitleSize = throttle(
        this.updateSubtitleSize.bind(this),
        500
      ))
    );

    if (!options.disableAirPlay) {
      this.setupAirPlay();
    }
  }

  private setState(state: Partial<CorePlayerState>, emit = true): void {
    if (this.destroyed) {
      return;
    }
    this.state = {
      ...this.state,
      ...state,
    };
    emit && this.emit(PlayerEvents.STATE_CHANGED, this.state);

    // if the subtitleSize have never been set try to set it
    if (!this.subtitleSizeSet) {
      this.updateSubtitleSize();
    }
  }

  /**
   * Call this method to check if the instance is "alive",
   * if the instance has been destroyed this method will
   * throw an error for you
   */
  private checkInstance() {
    if (this.destroyed) {
      const message =
        "Cannot load on a destroyed instance of the player. Please create a new instance";
      throw new InitError(message, {
        type: ErrorTypes.DESTROYED,
      });
    }
  }

  private updateSubtitleSize() {
    const subtitleWidth = this.subtitleContainer.clientWidth;
    if (subtitleWidth) {
      this.subtitleSizeSet = true;
      // Allow the container font-size to be between 0.2em and 2em
      const fontSize = Math.min(2, Math.max(0.2, subtitleWidth / 1000));
      this.subtitleContainer.style.fontSize = `${fontSize}em`;
    }
  }

  private setupAirPlay() {
    this.airPlay = new AirPlay(this.videoElement);
    this.airPlay.on(
      AirPlayEvent.AVAILABILITY_CHANGED,
      ({ available }: { available: boolean }) => {
        this.setState({ isAirPlayAvailable: available });
      }
    );
    this.airPlay.on(AirPlayEvent.CONNECTED, () => {
      this.setState({ isAirPlaying: true });
      this.emit(PlayerEvents.AIRPLAY_START, undefined);
    });
    this.airPlay.on(AirPlayEvent.DISCONNETED, () => {
      this.setState({ isAirPlaying: true });
      this.emit(PlayerEvents.AIRPLAY_STOP, undefined);
    });
  }

  private get Player(): typeof BasePlayer {
    const { isAsset, mediaInfo, playResponse } = this.instanceSettings;
    const stitcher = mediaInfo?.ssai ? playResponse?.ads?.stitcher : undefined;
    if (mediaInfo?.lowLatency) {
      return LowLatencyPlayer;
    }
    if (stitcher === "INTERNAL" || stitcher === "NOWTILUS") {
      return AdInsertionPlayer;
    }
    if (isAsset) {
      return AssetPlayer;
    }
    return BasePlayer;
  }

  private loadPlayer(startTime?: number): void {
    if (!this.player) {
      return;
    }
    this.player.load(startTime);
    this.player.once(PlayerEvents.LOADED, () => {
      if (this.autoplay) {
        this.play()?.catch(() => {
          info("Autoplay detection invalid, failed to autoplay");
        });
      }
    });
  }

  private async updateMetadata(
    loadOptions?: Partial<ILoadOptions>,
    formats?: MediaFormat[]
  ): Promise<void> {
    let playResponse: PlayResponse | undefined;
    let assetMetadata: Asset | undefined;
    let mediaInfo: IMediaInfo = {
      isLive: false,
      lowLatency: false,
    };
    const { audioOnly, source, materialProfile } = loadOptions || {};
    const {
      autoplay,
      adobePrimetimeToken,
      businessUnit,
      customer,
      exposureBaseUrl: baseUrl,
      maxResolution,
      sessionToken,
    } = this.instanceSettings.initOptions;
    if (
      sessionToken &&
      customer &&
      businessUnit &&
      baseUrl &&
      !formats &&
      loadOptions &&
      source &&
      !source.includes("://")
    ) {
      const { start, end } = loadOptions.manifest || {};
      const isExternalId = source.startsWith(EXTERNAL_PREFIX);
      const assetId = isExternalId
        ? source.slice(EXTERNAL_PREFIX.length)
        : source;
      this.exposureService = new ExposureService({
        customer,
        businessUnit,
        baseUrl,
      });
      this.exposureBaseUrl = baseUrl;
      const playRequest = this.exposureService.playRequest({
        assetId,
        sessionToken,
        adsOptions: await enrichAdsOptions(
          loadOptions?.ads || {},
          this.videoElement,
          await this.getDevice(),
          autoplay
        ),
        audioOnly,
        adobePrimetimeToken,
        maxResolution,
        supportedKeySystem: this.instanceSettings.supportedKeySystem,
        supportedFormatTypes: getSupportedFormats(),
        materialProfile,
        start,
        end,
      });

      if (isExternalId) {
        // must fetch the play response first to get the full id
        playResponse = await playRequest;
        if (!playResponse.assetId) {
          throw new InitError(
            "Could not fetch information for the given source asset id",
            { type: ErrorTypes.OPTIONS }
          );
        }
        loadOptions.source = playResponse.assetId;
        assetMetadata = await this.exposureService.assetMetadata(
          playResponse.assetId
        );
      } else {
        // regular asset id can fetch in parallel
        [playResponse, assetMetadata] = await Promise.all([
          playRequest,
          this.exposureService.assetMetadata(assetId),
        ]);
      }
      formats = playResponse.formats;
      mediaInfo = {
        isLive: playResponse?.streamInfo?.live,
        lowLatency: assetMetadata?.materialType === "LOW_LATENCY_CHANNEL",
        ssai: playResponse?.streamInfo?.ssai,
      };

      this.setContractRestrictions(playResponse?.contractRestrictions);
    }

    Object.assign(this.instanceSettings, {
      playResponse,
      assetMetadata,
      formats,
      isAsset: Boolean(formats),
      loadOptions,
      mediaInfo,
    });
  }

  private setContractRestrictions(contractRestrictions?: ContractRestrictions) {
    if (contractRestrictions) {
      if (contractRestrictions.airplayEnabled === false) {
        this.airPlay?.disable();
      } else {
        this.airPlay?.enable();
      }
      this.setState({
        contractRestrictions,
      });
    }
  }

  private setupProgramService() {
    // if it's nether a linear channel nor having a "parent" channel id. Don't initiate.
    const { assetMetadata, initOptions, playResponse } = this.instanceSettings;
    const { businessUnit, customer, exposureBaseUrl, sessionToken } =
      initOptions;

    if (
      !customer ||
      !businessUnit ||
      !exposureBaseUrl ||
      !sessionToken ||
      !assetMetadata ||
      !playResponse?.epg ||
      (assetMetadata?.type !== "TV_CHANNEL" &&
        !playResponse?.streamInfo?.channelId)
    )
      return;

    this.programService = new ProgramService({
      asset: assetMetadata,
      play: playResponse,
      baseUrl: exposureBaseUrl,
      customer,
      businessUnit,
      sessionToken,
    });

    this.player?.on(PlayerEvents.TIME_UPDATE, ({ utcCurrentTime }: any) =>
      this.programService?.ping(utcCurrentTime)
    );

    // Event for entitlement blocks
    this.programService.on(ProgramServiceEvent.NOT_ENTITLED, (data) => {
      this.emit(PlayerEvents.NOT_ENTITLED, data);
      this.player?.stop();
    });
    this.programService.on(ProgramServiceEvent.BLACKOUT, (data) => {
      this.emit(PlayerEvents.BLACKOUT, data);
    });
    this.programService.on(ProgramServiceEvent.EMPTY_SLOT, () => {
      this.emit(PlayerEvents.EMPTY_SLOT, undefined);
    });
    // Event for what we're currently watching
    this.programService.on(
      ProgramServiceEvent.PROGRAM_CHANGED,
      ({ currentProgram, upcomingProgram }) => {
        this.instanceSettings.programData = {
          current: currentProgram,
          next: upcomingProgram,
        };
        this.emit(PlayerEvents.PROGRAM_CHANGED, {
          channel: assetMetadata,
          program: currentProgram,
          upnext: upcomingProgram,
        });
      }
    );
  }

  private setupPlayerEventListeners() {
    this.player?.onAll(({ event, data }) => {
      switch (event) {
        case INTERNAL_STATE_CHANGED:
          // re-emitting PlayerEvents.STATE_CHANGED is done in this.setState()
          this.setState(data);
          break;
        default:
          this.emit(event, data);
          break;
      }
    });
  }

  public getPlayerInfo() {
    const engineName = this.player?.getPlayerEngineName();
    const engineVersion = this.player?.getPlayerEngineVersion();
    return {
      playerVersion: this.instanceSettings.playerSDKVersion,
      playerEngine: {
        name: engineName,
        version: engineVersion,
      },
    };
  }

  public async getDevice() {
    return await getDevice(this.deviceAdapter);
  }

  public getStreamInfo(): IPlayerStreamInfo | undefined {
    if (!this.player) return;
    return this.player.getStreamInfo();
  }

  public getSession(): IPlayerSession {
    const { initOptions, loadOptions, playResponse } = this.instanceSettings;
    const { sessionToken } = initOptions;
    const { playSessionId, requestId, assetId } = playResponse || {};
    return {
      ...(assetId && { assetId }),
      initOptions,
      loadOptions,
      sessionToken,
      ...(playResponse && { playSessionId }),
      ...(playResponse && { requestId }),
      playbackFormat: this.player?.getPlaybackFormat(),
      playerEngine: this.player && {
        name: this.player.getPlayerEngineName(),
        version: this.player.getPlayerEngineVersion(),
      },
      autoplay: this.autoplay,
      locale: initOptions.locale || "en",
      ...(playResponse?.cdn?.provider && {
        cdnProvider: playResponse.cdn?.provider,
      }),
      ...(playResponse?.analytics && {
        analyticsPostInterval: playResponse.analytics?.postInterval,
        analyticsBucket: playResponse.analytics?.bucket,
        analyticsTag: playResponse.analytics?.tag,
        analyticsBaseUrl: playResponse.analytics?.baseUrl,
        analyticsPercentage: playResponse.analytics?.percentage ?? 100,
      }),
      exposureBaseUrl: this.exposureBaseUrl,
    };
  }

  public getAssetInfo(): Asset | undefined {
    return this.instanceSettings?.assetMetadata;
  }

  public getProgramInfo():
    | { current?: LiveAsset; next?: LiveAsset }
    | undefined {
    return this.instanceSettings?.programData;
  }

  public getContractRestrictions() {
    return this.instanceSettings.playResponse?.contractRestrictions;
  }

  public getContainerElement() {
    return this.container;
  }

  public getVideoElement() {
    return this.videoElement;
  }

  public getSubtitleContainerElement(): HTMLDivElement {
    return this.subtitleContainer;
  }

  /**
   * Get timeline cuepoints with sprite images showing a snapshot of the
   * content at that point in time.
   * @param  {number}                width  desired width of the image, uses the videoElement width / 4 as default
   * @return {Promise<ISpriteCue[]>}
   */
  public getTimelineSpriteCues(width?: number): Promise<ISpriteCue[]> {
    width = width || this.videoElement.offsetWidth / 4;
    const sprites = this.instanceSettings.playResponse?.sprites;
    if (sprites?.length) {
      let offset = 0;
      let vtt: string | undefined;
      for (const sprite of sprites) {
        vtt = sprite.vtt;
        if (sprite.offsetInMs) {
          offset = sprite.offsetInMs / 1000;
        }
        if (sprite.vtt && width <= sprite.width) {
          break;
        }
      }
      if (vtt) {
        return (
          this.spriteCueCache[vtt] ||
          (this.spriteCueCache[vtt] = getTimelineSpriteCues(vtt, offset))
        );
      }
    }
    return Promise.resolve([]);
  }

  public getState(): CorePlayerState {
    return this.state;
  }

  public getCurrentTime() {
    return this.player?.getCurrentTime();
  }

  public getVolume() {
    return this.player?.getVolume();
  }

  private async _load(
    options?: Partial<ILoadOptions>,
    formats?: MediaFormat[]
  ) {
    const { autoplay, muted } = this.instanceSettings.initOptions;
    this.emit(PlayerEvents.LOAD_START, undefined);
    this.setState({ playbackState: PlaybackState.LOADING });
    // Only need to check once, since initOptions stays the same
    if (this.autoplay === undefined) {
      this.autoplay = autoplay ? await isAutoplaySupported(muted) : false;
    }
    if (options?.poster) {
      this.videoElement.setAttribute("poster", options.poster);
    } else {
      this.videoElement.removeAttribute("poster");
    }
    this.checkInstance();
    this.instanceSettings.supportedKeySystem = await getSupportedDrm(
      this.instanceSettings.initOptions.keysystem
    );
    this.checkInstance();
    this.emit(PlayerEvents.PLAYER_SETUP_COMPLETED, undefined);
    await this.updateMetadata(options, formats);
    this.checkInstance();
    this.emit(PlayerEvents.ENTITLEMENT_GRANTED, undefined);

    this.player = new this.Player(
      this.videoElement,
      this.subtitleContainer,
      this.instanceSettings,
      options?.source
    );

    this.setupPlayerEventListeners();
    this.setupProgramService();
    this.emit(PlayerEvents.LOADING, {
      ...(this.instanceSettings.playResponse?.playSessionId && {
        playSessionId: this.instanceSettings.playResponse.playSessionId,
      }),
    });
    if (this.instanceSettings.assetMetadata) {
      new MediaSessionManager(this.player, this.instanceSettings);
    }
    this.loadPlayer(
      options?.startTime ?? getStartTime(this.instanceSettings.playResponse)
    );
  }

  public load(options: ILoadOptions): void {
    this._load(options).catch((error) => {
      this.setState({ playbackState: PlaybackState.ERROR });
      this.emit(PlayerEvents.ERROR, error);
    });
  }

  // Preloaded on the server side
  public loadFromFormats(
    formats: MediaFormat[],
    options?: Omit<ILoadOptions, "source" | "manifest">
  ): void {
    this._load(options, formats).catch((error) => {
      this.setState({ playbackState: PlaybackState.ERROR });
      this.emit(PlayerEvents.ERROR, error);
    });
  }

  public play() {
    return this.player?.play();
  }

  public getSeekable() {
    return this.player?.getSeekable();
  }

  public pause() {
    this.player?.pause();
  }

  public setMuted(muted: boolean) {
    this.player?.setMuted(muted);
  }

  public toggleMuted() {
    this.player?.toggleMuted();
  }

  public clickThrough() {
    this.player?.clickThrough();
  }

  public isFullscreen() {
    if (this.fullscreenManager) {
      return this.fullscreenManager.isFullscreen();
    }
  }

  public toggleFullscreen() {
    if (this.fullscreenManager) {
      this.fullscreenManager.toggleFullscreen();
    }
  }

  public isPictureInPicture() {
    return this.pipManager?.isPictureInPicture();
  }

  public isPictureInPictureAvailable() {
    return this.pipManager?.isPictureInPictureAvailable();
  }

  public togglePictureInPicture() {
    return this.pipManager?.togglePictureInPicture();
  }

  public isAirplaySupported() {
    return this.airPlay?.isSupported() ?? false;
  }

  public isAirplaying() {
    return this.state?.isAirPlaying ?? false;
  }

  public toggleAirPlay() {
    return this.airPlay?.toggleAirPlay();
  }

  public seekTo(time: number) {
    this.player?.seekTo(time);
  }

  public seekToUTC(utcTime: number) {
    let seekToSec = (utcTime - this.state.utcSeekable.start) / 1000;
    if (this.state.seekable.start) seekToSec += this.state.seekable.start;
    this.player?.seekTo(seekToSec);
  }

  public scrub(offset: number) {
    this.player?.scrub(offset);
  }

  public seekToLive() {
    if (this.isLive()) {
      this.player?.seekToLive();
    }
  }

  public setPlaybackRate(rate: number): void {
    if (this.player) {
      this.player?.setPlaybackRate(rate);
    }
  }

  public setQualityLevel(level: QualityLevel) {
    if (this.player) {
      this.player?.setQualityLevel(level);
    }
  }

  public getQualityLevels(): QualityLevel[] {
    if (this.player) {
      return this.player?.getQualityLevels();
    }
    return [];
  }

  public setAudioTrack(track: Track) {
    this.player?.setAudioTrack(track);
  }

  public setSubtitleTrack(track?: Track) {
    this.player?.setSubtitleTrack(track);
  }

  public setVolume({ percentage }: { percentage: number }) {
    this.player?.setVolume({ percentage });
  }

  public getAudioTrack(): Track | undefined {
    return this.player?.getAudioTrack();
  }

  public getAudioTracks(): Track[] {
    return this.player?.getAudioTracks() ?? [];
  }

  public getSubtitleTrack(): Track | undefined {
    return this.player?.getSubtitleTrack();
  }

  public getSubtitleTracks(): Track[] {
    return this.player?.getSubtitleTracks() ?? [];
  }

  public isLive() {
    let live = this.player?.isLive();
    // If the player engine hasn't been initialized yet, we'll use the mediaInfo to determine if it's a live stream.
    // This so that we can initialize analytics with the correct live state.
    if (live === undefined && this.instanceSettings.mediaInfo) {
      live = this.instanceSettings.mediaInfo.isLive;
    }
    return live;
  }

  public isPlaying() {
    return this.player?.isPlaying() ?? false;
  }

  // is the current browser/device supported
  // We should probably try to deprecate this for the static one, but it's used in PlayerCoreConnector
  public isBrowserSupported() {
    return isBrowserSupported();
  }
  // same as above but exposed before an instance is created
  public static isBrowserSupported() {
    return isBrowserSupported();
  }

  public isVolumeReadOnly() {
    return isVolumeReadOnly();
  }

  public isPictureInPictureSupported() {
    return PictureInPictureManager.isSupported();
  }
  public static isPictureInPictureSupported() {
    return PictureInPictureManager.isSupported();
  }

  public destroy(): void {
    this.destroyed = true;
    this.pipManager?.destroy();
    this.player?.destroy();
    this.programService?.destroy();
    this.container.remove();
    window.removeEventListener(
      "resize",
      this.throttledUpdateSubtitleSize as any
    );
    super.destroy();
  }
}
