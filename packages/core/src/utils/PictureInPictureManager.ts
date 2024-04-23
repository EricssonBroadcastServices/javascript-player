// SPDX-FileCopyrightText: 2024 Red Bee Media Ltd <https://www.redbeemedia.com/>
//
// SPDX-License-Identifier: MIT

export class PictureInPictureManager {
  private videoElement: HTMLVideoElement;

  constructor(videoElement: HTMLVideoElement) {
    this.videoElement = videoElement;
  }

  static isSupported() {
    return document.pictureInPictureEnabled ?? false;
  }

  isPictureInPicture(): boolean {
    return !!document.pictureInPictureElement;
  }

  isPictureInPictureAvailable(): boolean {
    return (
      this.videoElement.videoHeight !== 0 || this.videoElement.videoWidth !== 0
    );
  }

  requestPictureInPicture(): void {
    if (!this.isPictureInPictureAvailable()) {
      return;
    }
    this.videoElement.requestPictureInPicture?.();
  }

  exitPictureInPicture(): void {
    document.exitPictureInPicture?.();
  }

  togglePictureInPicture(): void {
    if (this.isPictureInPicture()) {
      this.exitPictureInPicture();
    } else {
      this.requestPictureInPicture();
    }
  }

  destroy() {
    if (this.isPictureInPicture()) {
      this.exitPictureInPicture();
    }
  }
}
