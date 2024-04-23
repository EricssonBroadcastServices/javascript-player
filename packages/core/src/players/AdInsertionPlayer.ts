// SPDX-FileCopyrightText: 2024 Red Bee Media Ltd <https://www.redbeemedia.com/>
//
// SPDX-License-Identifier: MIT

import {
  AdMonitor,
  AdMonitorEvent,
} from "@ericssonbroadcastservices/js-player-ad-monitor";
import {
  ContentType,
  ErrorTypes,
  IAdBlock,
  IAdDataRepresentation,
  InitError,
  PlayerEvents,
} from "@ericssonbroadcastservices/js-player-shared";

import { getBrowser, isLGTV, isSamsungTV } from "../device/common";
import { AbstractBaseEngine } from "../engines/AbstractBaseEngine";
import { DashJs } from "../engines/DashJs";
import { HlsJs } from "../engines/HlsJs";
import { Native } from "../engines/Native";
import { Shaka } from "../engines/Shaka";
import { isNativeHlsSupported } from "../utils/helpers";
import { InstanceSettingsInterface } from "../utils/interfaces";
import { AssetPlayer } from "./AssetPlayer";

export class AdInsertionPlayer extends AssetPlayer {
  adMonitor?: AdMonitor;
  adBlocks: IAdBlock[] = [];

  deferredSeekTime?: number;

  visibilityListener?: () => void;
  automaticallyPaused?: boolean;

  private subtitleRestoreSeek = false;

  constructor(
    videoElement: HTMLVideoElement,
    subtitleContainer: HTMLDivElement,
    instanceSettings: InstanceSettingsInterface,
    source?: string
  ) {
    super(videoElement, subtitleContainer, instanceSettings, source);

    this.setupVisibilityListener();

    const ads = this.instanceSettings.playResponse?.ads;
    if (ads) {
      this.adMonitor = new AdMonitor(this.getFormat(), ads);
      this.setupAdMonitorEventListeners(this.adMonitor);

      // AdBlocks created as part of the constructor are not emitted as events, so we need to manually add them to the adBlocks array.
      const adBlocks = this.adMonitor.getAdBlocks();
      adBlocks.forEach((adBlock) => this.onAdBlockAdded(adBlock));
    }
  }

  load(relativeStartTime: number) {
    const absoluteStartTime = this.getAbsoluteTime(relativeStartTime);
    // mark the closest adblock as watched.
    for (let i = this.adBlocks.length - 1; i >= 0; i--) {
      const adBlock = this.adBlocks[i];
      if (adBlock.endTime <= absoluteStartTime) {
        this.onAdBlockWatched(adBlock);
        break;
      }
    }
    return super.load(absoluteStartTime);
  }

  getPlayerEngine(): AbstractBaseEngine {
    const format = this.getFormat();

    this.mediaLocator = format.mediaLocator;
    this.license = format.drm;
    this.playbackFormat = format.format;

    if (process.env.NODE_ENV === "development") {
      const devEngine = this.getPlayerEngineDev();
      if (devEngine) {
        return devEngine;
      }
    }
    switch (format.format) {
      case "HLS":
        if (isNativeHlsSupported()) {
          return new Native(this.videoElement, this.instanceSettings);
        }
        return new HlsJs(this.videoElement, this.instanceSettings);
      case "DASH": {
        if (isLGTV() || getBrowser() === "firefox") {
          return new DashJs(this.videoElement, this.instanceSettings);
        }
        return new Shaka(this.videoElement, this.instanceSettings);
      }
      default: {
        const errMessage = `Ad Stitching Support for ${format} not yet implemented`;
        throw new InitError(errMessage, {
          type: ErrorTypes.OPTIONS,
        });
      }
    }
  }

  setupVisibilityListener() {
    document.addEventListener(
      "visibilitychange",
      (this.visibilityListener = () => {
        if (
          document.visibilityState === "hidden" &&
          this.state.contentType === ContentType.AD
        ) {
          this.pause();
          this.automaticallyPaused = true;
        } else if (
          document.visibilityState === "visible" &&
          this.automaticallyPaused
        ) {
          this.play();
          this.automaticallyPaused = false;
        }
      })
    );
  }

  setupAdMonitorEventListeners(adMonitor: AdMonitor) {
    adMonitor.on(AdMonitorEvent.ADBLOCK_START, (data: IAdBlock) => {
      this.onSubtitleCueChanged([]);
      super.setPlaybackRate(1);
      // prevent setting playbackRate during an ad break
      // shaka player internally uses playbackRate 0 for paused state so we have to allow that too
      this.videoElement.onratechange = () => {
        if (![0, 1].includes(this.videoElement.playbackRate)) {
          this.videoElement.playbackRate = 1;
        }
      };
      this.emit(PlayerEvents.ADBLOCK_START, data);
      this.setState({ contentType: ContentType.AD });

      if (document.visibilityState === "hidden") {
        this.pause();
        this.automaticallyPaused = true;
      }
      this.disableSeek();
    });
    adMonitor.on(AdMonitorEvent.ADBLOCK_END, (msAdBlock?: IAdBlock) => {
      const adBlock = msAdBlock && this.secondifyAdBlock(msAdBlock);
      const { deferredSeekTime } = this;
      this.emit(PlayerEvents.ADBLOCK_COMPLETE, msAdBlock);
      this.setState({ contentType: this.mainContentType });
      if (adBlock) {
        this.onAdBlockWatched(adBlock);
      }
      this.videoElement.onratechange = null;
      this.playerEngine.isSeekDisabled = false;

      // @todo: Try to move this workaround to the Shaka engine
      // Needed for Shaka to load the subtitle after a break
      if (!deferredSeekTime && this.getSubtitleTrack()) {
        this.subtitleRestoreSeek = true;
        // we can't just seek to the same time because that might seek to the closest integer on certain platforms
        // which will trigger the admonitor to emit ADBLOCK_END, again...
        this.videoElement.currentTime =
          isLGTV() || isSamsungTV()
            ? Math.ceil(this.videoElement.currentTime)
            : this.videoElement.currentTime;

        setTimeout(() => {
          // In case currentTime += 0 doesn't trigger seek on some browser, enable seek event emitting again after 0.1s
          this.subtitleRestoreSeek = false;
        }, 100);
      }
    });
    adMonitor.on(AdMonitorEvent.AD_START, (data: IAdDataRepresentation) => {
      if (this.state.contentType !== ContentType.AD) return;
      this.setState({
        currentAd: data,
      });
      this.emit(PlayerEvents.AD_START, data);
    });
    adMonitor.on(AdMonitorEvent.AD_END, (data: IAdDataRepresentation) => {
      if (this.state.contentType !== ContentType.AD) return;
      this.setState({
        currentAd: null,
      });
      this.emit(PlayerEvents.AD_COMPLETE, data);
    });

    adMonitor.on(AdMonitorEvent.ADBLOCK_ADDED, (adBlock: IAdBlock) => {
      this.onAdBlockAdded(adBlock);
    });
  }

  private disableSeek() {
    const activeAdBlock = this.getActiveAdBlock();
    // Make it possible to seek through already watched adblock
    if (
      this.state.contentType === ContentType.AD &&
      (!activeAdBlock || !this.isAdBlockWatched(activeAdBlock))
    ) {
      this.playerEngine.isSeekDisabled = true;
    }
  }

  /**
   * Convert all millisecond values in an adblock to seconds
   * @param  {IAdBlock} adBlock
   * @return {IAdBlock}
   */
  private secondifyAdBlock(adBlock: IAdBlock): IAdBlock {
    return {
      ...adBlock,
      startTime: adBlock.startTime / 1000,
      endTime: adBlock.endTime / 1000,
      duration: adBlock.duration / 1000,
      relativeStartTime: adBlock.relativeStartTime / 1000,
    };
  }

  onAdBlockAdded(adBlock: IAdBlock) {
    this.adBlocks.push(this.secondifyAdBlock(adBlock));

    if (this.mainContentType === ContentType.VOD) {
      // For vod we want to setup markers to visualize ad breaks as well as prevent scrubbing past ad breaks
      const adMarkers = [...(this.state.adMarkers ?? [])];
      adMarkers.push({
        watched: false,
        startTime: adBlock.relativeStartTime / 1000,
        duration: adBlock.endTime / 1000 - adBlock.startTime / 1000,
      });

      this.setState({
        adMarkers,
      });
    }
  }

  onAdBlockWatched(adBlock: IAdBlock) {
    const adMarkers = [...(this.state.adMarkers ?? [])];
    // when we have ad markers (VOD) we want to set these as watched on end
    const adBlockMarker = adMarkers.find(
      (adMarker) =>
        Math.floor(adMarker.startTime) === Math.floor(adBlock.relativeStartTime)
    );
    if (adBlockMarker) {
      adBlockMarker.watched = true;
      this.setState({
        adMarkers,
      });
    }
    // if the user scrubbed past the ad break, we will seek to that deferred time
    this.seekToDeferredTime();
  }

  setPlaybackRate(rate: number) {
    if (this.state.contentType === ContentType.AD) return;
    super.setPlaybackRate(rate);
  }

  isSeekable() {
    const activeAdBlock = this.getActiveAdBlock();
    if (
      this.state.contentType === ContentType.AD &&
      (!activeAdBlock || !this.isAdBlockWatched(activeAdBlock))
    ) {
      return false;
    }
    return super.isSeekable();
  }

  getSeekable() {
    if (this.mainContentType === ContentType.LIVE) {
      return super.getSeekable();
    }
    return { start: 0, end: this.getDuration() };
  }

  getCurrentTime() {
    const absoluteTime = super.getCurrentTime();
    if (this.mainContentType === ContentType.LIVE) {
      return absoluteTime;
    }
    if (this.deferredSeekTime) {
      return this.deferredSeekTime;
    }
    let adBreakTimeConsumption = 0;
    this.adBlocks.forEach((adBlock) => {
      const absoluteStartTime = adBlock.startTime;
      const absoluteEndTime = adBlock.endTime;
      if (absoluteTime >= absoluteEndTime) {
        adBreakTimeConsumption += adBlock.duration;
      } else if (
        absoluteTime > absoluteStartTime &&
        absoluteTime < absoluteEndTime
      ) {
        adBreakTimeConsumption += absoluteTime - absoluteStartTime;
      }
    });
    return absoluteTime - adBreakTimeConsumption;
  }

  getDuration() {
    if (this.mainContentType === ContentType.LIVE) {
      return super.getDuration();
    }
    const totalAdDuration = this.adBlocks.reduce((duration, adBlock) => {
      return duration + adBlock.duration;
    }, 0);
    return super.getDuration() - totalAdDuration;
  }

  seekTo(time: number) {
    if (!this.isSeekable()) {
      return;
    }
    if (this.mainContentType === ContentType.VOD) {
      // convert seek time in content to the absolute video time
      let absoluteSeekTime = this.getAbsoluteTime(time);

      // check if we've watched the adbreak related to the new position
      const adBlock = this.getRelatedAdBlock(absoluteSeekTime);
      if (adBlock && !this.isAdBlockWatched(adBlock)) {
        // redirect the user to the adbreak but save the seek to continue after the user have watched the break
        this.deferredSeekTime = time;
        absoluteSeekTime = adBlock.startTime;
      }

      super.seekTo(absoluteSeekTime);
    } else {
      super.seekTo(time);
    }
  }

  clickThrough(): void {
    if (this.state.currentAd?.clickThrough) {
      const clickThroughUrl = this.state.currentAd?.clickThrough;
      const clickTrackingUrls =
        this.state.currentAd?.trackingEvents?.clickThrough;
      window.open(clickThroughUrl, "_blank");
      if (clickTrackingUrls) {
        clickTrackingUrls.forEach(async (url) => {
          new Image().src = url;
        });
      }
      this.pause();
    } else {
      super.clickThrough();
    }
  }

  onBuffering() {
    if (!isLGTV()) {
      return super.onBuffering();
    }
    const currentTime = this.getCurrentTime();
    const absoluteCurrentTime = this.getAbsoluteTime(currentTime);

    // Haxxaround to fix stalling before ads
    // check if we're outside any buffered range and if so
    // check if we have an upcoming adblock in the next 5 seconds
    // if we do, seek to it, we're stalling because of it.
    const buffered = this.videoElement.buffered;
    if (buffered.length) {
      const bufferedEnd = buffered.end(buffered.length - 1);
      if (absoluteCurrentTime > bufferedEnd - 0.5) {
        const adBlock = this.getRelatedAdBlock(absoluteCurrentTime + 5);
        if (
          adBlock &&
          currentTime < adBlock.startTime &&
          !this.isAdBlockWatched(adBlock)
        ) {
          return super.seekTo(adBlock.startTime);
        }
      }
    }
    super.onBuffering();
  }

  onTimeUpdate() {
    if (this.mainContentType === ContentType.VOD) {
      const activeAdBlock = this.getActiveAdBlock();
      if (activeAdBlock) {
        const isAdBlockWatched = this.isAdBlockWatched(activeAdBlock);
        if (isAdBlockWatched) {
          // seek isn't high-precision so a seek to 96.6 might go to 96
          // this would cause this code we're in right now to loop infinitely, to avoid that
          // we always round up the value
          const endTime = Math.ceil(activeAdBlock.endTime);
          super.seekTo(endTime);
          return;
        }
      }
    }
    if (this.adMonitor) {
      this.adMonitor.handleTimeUpdate({
        utcCurrentTime: super.getUTCCurrentTime(),
        currentTime: super.getCurrentTime(),
      });
    }
    super.onTimeUpdate();
  }

  onSeeking() {
    // This should never happen, but just in case we're seeking outside of an adbreak and seek is disabled reenable it
    if (
      this.state.contentType !== ContentType.AD &&
      this.playerEngine.isSeekDisabled
    ) {
      this.playerEngine.isSeekDisabled = false;
    }
    if (this.mainContentType === ContentType.VOD) {
      const relatedAdBlock = this.getRelatedAdBlock(super.getCurrentTime());
      if (
        relatedAdBlock &&
        relatedAdBlock !== this.getActiveAdBlock() &&
        !this.isAdBlockWatched(relatedAdBlock)
      ) {
        super.seekTo(relatedAdBlock.startTime);
        return;
      }
    }
    if (!this.subtitleRestoreSeek) {
      super.onSeeking();
    }
  }

  onSeeked(): void {
    if (this.subtitleRestoreSeek) {
      this.subtitleRestoreSeek = false;
      return;
    }
    super.onSeeked();
  }

  onEnded() {
    this.adMonitor?.handleEnded();
    super.onEnded();
  }

  private getActiveAdBlock(): IAdBlock | null {
    const absoluteTime = super.getCurrentTime();

    // this method is called _before_ this class is instantiated which is why adBlocks is undefined
    // most likely a typescript bug
    const adBlocks = this.adBlocks || [];
    const adBlock = adBlocks.find(
      (adBlock) =>
        absoluteTime >= Math.floor(adBlock.startTime) &&
        absoluteTime < adBlock.endTime
    );

    return adBlock || null;
  }

  private getRelatedAdBlock(absoluteTime: number): IAdBlock | null {
    for (let i = this.adBlocks.length - 1; i >= 0; i--) {
      const adBlock = this.adBlocks[i];
      if (Math.floor(adBlock.startTime) <= absoluteTime) {
        return adBlock;
      }
    }
    return null;
  }

  private seekToDeferredTime() {
    if (this.deferredSeekTime) {
      const time = this.deferredSeekTime;
      this.deferredSeekTime = undefined;
      if (!this.playerEngine.isEnded()) {
        this.seekTo(time);
      }
    }
  }

  private getAbsoluteTime(relativeTime: number): number {
    if (this.mainContentType !== ContentType.VOD) {
      return relativeTime; // only VOD have relativeTime
    }
    return this.adBlocks.reduce((seekTime, adBlock) => {
      if (adBlock.relativeStartTime < relativeTime) {
        return seekTime + adBlock.duration;
      }
      return seekTime;
    }, relativeTime);
  }

  /**
   * Check if a provided adBlock has been watched, note that live adblocks are not marked as watched
   * which means this will always return false
   * @param {IAdBlock} adBlock
   */
  private isAdBlockWatched(adBlock: IAdBlock) {
    return (
      this.state.adMarkers?.some(
        (adMarker) =>
          Math.floor(adMarker.startTime) ===
            Math.floor(adBlock.relativeStartTime) && adMarker.watched
      ) ?? false
    );
  }

  public destroy() {
    if (this.visibilityListener) {
      document.removeEventListener("visibilitychange", this.visibilityListener);
    }
    this.adMonitor?.destroy();
    super.destroy();
  }
}
