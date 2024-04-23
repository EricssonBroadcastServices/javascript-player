// SPDX-FileCopyrightText: 2024 Red Bee Media Ltd <https://www.redbeemedia.com/>
//
// SPDX-License-Identifier: MIT

import { PlayerError } from "@ericssonbroadcastservices/js-player-shared";

import { HTMLMediaEvent } from "../interfaces";
import { convertError } from "./NativeErrors";

describe("convertError", () => {
  it("should add metadata props if valid error", async () => {
    // Note: The only way to create a real MediaError is to create a video element
    // add an error eventListener and do something invalid like video.src = "bad data"
    // But this seems to only work in a real browser, not Jest's preconfigured jsdom environment
    // so we can't actually catch a MediaError or an Event for that matter (because event.target is a getter)

    const errorMessage = "Empty source attribute";
    const fakeError = { code: 4, message: errorMessage };
    const playerErr = convertError({
      target: {
        error: fakeError,
      },
    } as HTMLMediaEvent);

    expect(playerErr).toBeInstanceOf(PlayerError);
    expect(playerErr.message).toBe(errorMessage);
    expect(playerErr.metadata).toMatchObject({ code: 4, rawError: fakeError });
    expect(playerErr.toString()).toBe(
      `PLAYER Error: ${errorMessage} {type: SOURCE_NOT_SUPPORTED, code: 4}`
    );
  });
});
