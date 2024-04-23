// SPDX-FileCopyrightText: 2024 Red Bee Media Ltd <https://www.redbeemedia.com/>
//
// SPDX-License-Identifier: MIT

declare global {
  interface Document {
    mozFullScreen?: any;
    mozCancelFullScreen?: () => Promise<void>;
    msExitFullscreen?: () => Promise<void>;
    webkitIsFullScreen?: any;
    webkitExitFullscreen?: () => Promise<void>;
    webkitCancelFullScreen?: any;
    webkitExitFullScreen?: any;
    mozFullScreenElement?: Element;
    msFullscreenElement?: Element;
    webkitFullscreenElement?: Element;
  }

  interface HTMLElement {
    msRequestFullscreen?: () => Promise<void>;
    mozRequestFullscreen?: () => Promise<void>;
    webkitRequestFullscreen?: () => Promise<void>;
  }
}
export class FullscreenManager {
  private wrapper: any;
  private videoElement: any;

  constructor(wrapper: Element, videoElement: HTMLVideoElement) {
    this.wrapper = wrapper;
    this.videoElement = videoElement;
  }

  isFullscreen(): boolean {
    return (
      document.fullscreen ||
      document.webkitIsFullScreen ||
      document.mozFullScreen
    );
  }

  enterFullscreen(): void {
    const wrapperElement = this.wrapper;
    const videoElement = this.videoElement;

    let promise: Promise<void> | undefined;
    if (wrapperElement.requestFullscreen) {
      promise = wrapperElement.requestFullscreen();
    } else if (wrapperElement.msRequestFullscreen) {
      promise = wrapperElement.msRequestFullscreen();
    } else if (wrapperElement.mozRequestFullScreen) {
      promise = wrapperElement.mozRequestFullScreen();
    } else if (wrapperElement.webkitRequestFullscreen) {
      promise = wrapperElement.webkitRequestFullscreen();
    } else if (wrapperElement.webkitRequestFullScreen) {
      promise = wrapperElement.webkitRequestFullScreen();
    } else if (wrapperElement.webkitEnterFullscreen) {
      promise = wrapperElement.webkitEnterFullscreen();
    } else if (videoElement.requestFullscreen) {
      promise = videoElement.requestFullscreen();
    } else if (videoElement.msRequestFullscreen) {
      promise = videoElement.msRequestFullscreen();
    } else if (videoElement.mozRequestFullScreen) {
      promise = videoElement.mozRequestFullScreen();
    } else if (videoElement.webkitRequestFullscreen) {
      promise = videoElement.webkitRequestFullscreen();
    } else if (videoElement.webkitRequestFullScreen) {
      promise = videoElement.webkitRequestFullScreen();
    } else if (videoElement.webkitEnterFullscreen) {
      promise = videoElement.webkitEnterFullscreen();
    }
    if (promise) {
      promise.catch(() => {
        /* no-op */
      });
    }
  }

  exitFullscreen(): void {
    const videoElement = this.videoElement;

    let promise: Promise<void> | undefined;
    if (document.exitFullscreen) {
      promise = document.exitFullscreen();
    } else if (document.msExitFullscreen) {
      promise = document.msExitFullscreen();
    } else if (document.mozCancelFullScreen) {
      promise = document.mozCancelFullScreen();
    } else if (document.webkitCancelFullScreen) {
      promise = document.webkitCancelFullScreen();
    } else if (document.webkitExitFullscreen) {
      promise = document.webkitExitFullscreen();
    } else if (document.webkitExitFullScreen) {
      promise = document.webkitExitFullScreen();
    } else if (videoElement.exitFullscreen) {
      promise = videoElement.exitFullscreen();
    } else if (videoElement.msExitFullscreen) {
      promise = videoElement.msExitFullscreen();
    } else if (videoElement.mozCancelFullScreen) {
      promise = videoElement.mozCancelFullScreen();
    } else if (videoElement.webkitCancelFullScreen) {
      promise = videoElement.webkitCancelFullScreen();
    } else if (videoElement.webkitExitFullscreen) {
      promise = videoElement.webkitExitFullscreen();
    } else if (videoElement.webkitExitFullScreen) {
      promise = videoElement.webkitExitFullScreen();
    }

    if (promise) {
      promise.catch(() => {
        /* no-op */
      });
    }
  }

  toggleFullscreen(): void {
    if (this.isFullscreen()) {
      this.exitFullscreen();
    } else {
      this.enterFullscreen();
    }
  }
}
