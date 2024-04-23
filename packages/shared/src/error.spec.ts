// SPDX-FileCopyrightText: 2024 Red Bee Media Ltd <https://www.redbeemedia.com/>
//
// SPDX-License-Identifier: MIT

import { APIError, ErrorTypes, PlayerError } from "./error";

describe("PlayerError", () => {
  it("should set metadata if valid", () => {
    const rawError = new Error("Unexpected something!");
    const playerErr = new PlayerError("Oops", {
      type: ErrorTypes.SEGMENT,
      code: 9000,
      rawError,
    });
    expect(playerErr.metadata).toMatchObject({
      type: ErrorTypes.SEGMENT,
      rawError,
      code: 9000,
    });
  });

  it("should not set null or undefined metadata", () => {
    const err = new PlayerError("Oops", {
      type: ErrorTypes.SEGMENT,
      code: undefined,
      rawError: null,
    });
    expect(err.metadata).toMatchObject({ type: ErrorTypes.SEGMENT });
  });

  it("should include the category and metadata in the toString result", () => {
    expect(
      new PlayerError("Oops", {
        type: ErrorTypes.SEGMENT,
      }).toString()
    ).toStrictEqual("PLAYER Error: Oops {type: SEGMENT_ERROR}");
    expect(
      new APIError("File not found", {
        type: ErrorTypes.NETWORK,
        code: 404,
      }).toString()
    ).toStrictEqual(
      "API Error: File not found {type: NETWORK_ERROR, code: 404}"
    );
  });
});
