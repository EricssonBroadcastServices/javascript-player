// SPDX-FileCopyrightText: 2024 Red Bee Media Ltd <https://www.redbeemedia.com/>
//
// SPDX-License-Identifier: MIT

import { ClockOffsetProvider } from "./ClockOffsetProvider";

describe("Server time/clock offset", () => {
  it("Server or network failure should fallback to an offset between -1 and 1 ms", async () => {
    const timeProvider = new ClockOffsetProvider(
      "https://exposure.api.redbee.failme"
    );
    const offset = await timeProvider.getClockOffset();
    timeProvider.destroy();
    expect([-1, 0, 1]).toContain(offset);
  });

  it("No server should return an offset between -1 and 1 ms", async () => {
    const timeProvider = new ClockOffsetProvider();
    const offset = await timeProvider.getClockOffset();
    timeProvider.destroy();
    expect([-1, 0, 1]).toContain(offset);
  });
});
