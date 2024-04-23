// SPDX-FileCopyrightText: 2024 Red Bee Media Ltd <https://www.redbeemedia.com/>
//
// SPDX-License-Identifier: MIT

import { ContractRestrictionsGuardian } from "./ContractRestrictionsGuardian";

describe("ContractRestrictionsGuardian", () => {
  let contractRestrictionGuardian;
  describe("isValidPosition", () => {
    describe("NO ContractRestriction set", () => {
      it("Should be valid for the first position", () => {
        contractRestrictionGuardian = new ContractRestrictionsGuardian({});
        const init = contractRestrictionGuardian.isValidPosition(1);
        expect(init.valid).toBe(true);
      });

      it("Should be valid if a minor position change happens there after", () => {
        contractRestrictionGuardian = new ContractRestrictionsGuardian({});
        contractRestrictionGuardian.isValidPosition(1);
        const next = contractRestrictionGuardian.isValidPosition(1.5);
        expect(next.valid).toBe(true);
      });

      it("should be valid if a bigger jump is made after the first one", () => {
        contractRestrictionGuardian = new ContractRestrictionsGuardian({});
        contractRestrictionGuardian.isValidPosition(1);
        const next = contractRestrictionGuardian.isValidPosition(25);
        expect(next.valid).toBe(true);
        expect(next.validPosition).toEqual(25);
      });
    });
    describe("Explicit false ContractRestriction set", () => {
      it("Should be valid for the first position", () => {
        contractRestrictionGuardian = new ContractRestrictionsGuardian({
          timeshiftEnabled: false,
          ffEnabled: false,
          rwEnabled: false,
        });
        const init = contractRestrictionGuardian.isValidPosition(1);
        expect(init.valid).toBe(true);
      });

      it("Should be valid if a minor position change happens there after", () => {
        contractRestrictionGuardian = new ContractRestrictionsGuardian({
          timeshiftEnabled: false,
          ffEnabled: false,
          rwEnabled: false,
        });
        contractRestrictionGuardian.isValidPosition(1);
        const next = contractRestrictionGuardian.isValidPosition(1.5);
        expect(next.valid).toBe(true);
      });

      it("Should be valid to have zero change", () => {
        contractRestrictionGuardian = new ContractRestrictionsGuardian({
          timeshiftEnabled: false,
          ffEnabled: false,
          rwEnabled: false,
        });
        contractRestrictionGuardian.isValidPosition(1);
        const next = contractRestrictionGuardian.isValidPosition(1);
        expect(next.valid).toBe(true);
      });

      it("should NOT be valid if a bigger jump is made after the first one", () => {
        contractRestrictionGuardian = new ContractRestrictionsGuardian({
          timeshiftEnabled: false,
          ffEnabled: false,
          rwEnabled: false,
        });
        contractRestrictionGuardian.isValidPosition(1);
        const next = contractRestrictionGuardian.isValidPosition(25);
        expect(next.valid).not.toBe(true);
        expect(next.validPosition).toEqual(1);
      });
    });
    describe("timeshiftEnabled ContractRestriction set", () => {
      it("should NOT be able to scrub forward with only timeshiftEnabled", () => {
        contractRestrictionGuardian = new ContractRestrictionsGuardian({
          timeshiftEnabled: true,
          ffEnabled: false,
          rwEnabled: false,
        });
        contractRestrictionGuardian.isValidPosition(1);
        const next = contractRestrictionGuardian.isValidPosition(25);
        expect(next.valid).not.toBe(true);
        expect(next.validPosition).toEqual(1);
      });
      it("should NOT be able to scrub backward with only timeshiftEnabled", () => {
        contractRestrictionGuardian = new ContractRestrictionsGuardian({
          timeshiftEnabled: true,
          ffEnabled: false,
          rwEnabled: false,
        });
        contractRestrictionGuardian.isValidPosition(25);
        const next = contractRestrictionGuardian.isValidPosition(1);
        expect(next.valid).not.toBe(true);
        expect(next.validPosition).toEqual(25);
      });
    });
    describe("timeshiftEnabled + ffEnabled ContractRestrictions set", () => {
      it("should be able to scrub forward", () => {
        contractRestrictionGuardian = new ContractRestrictionsGuardian({
          timeshiftEnabled: true,
          ffEnabled: true,
          rwEnabled: false,
        });
        contractRestrictionGuardian.isValidPosition(1);
        const next = contractRestrictionGuardian.isValidPosition(25);
        expect(next.valid).toBe(true);
        expect(next.validPosition).toEqual(25);
      });
      it("should NOT be able to scrub backward", () => {
        contractRestrictionGuardian = new ContractRestrictionsGuardian({
          timeshiftEnabled: true,
          ffEnabled: true,
          rwEnabled: false,
        });
        contractRestrictionGuardian.isValidPosition(25);
        const next = contractRestrictionGuardian.isValidPosition(1);
        expect(next.valid).not.toBe(true);
        expect(next.validPosition).toEqual(25);
      });
    });
    describe("timeshiftEnabled + rwEnabled ContractRestrictions set", () => {
      it("should NOT be able to scrub forward", () => {
        contractRestrictionGuardian = new ContractRestrictionsGuardian({
          timeshiftEnabled: true,
          ffEnabled: false,
          rwEnabled: true,
        });
        contractRestrictionGuardian.isValidPosition(1);
        const next = contractRestrictionGuardian.isValidPosition(25);
        expect(next.valid).not.toBe(true);
        expect(next.validPosition).toEqual(1);
      });
      it("should be able to scrub backward", () => {
        contractRestrictionGuardian = new ContractRestrictionsGuardian({
          timeshiftEnabled: true,
          ffEnabled: false,
          rwEnabled: true,
        });
        contractRestrictionGuardian.isValidPosition(25);
        const next = contractRestrictionGuardian.isValidPosition(1);
        expect(next.valid).toBe(true);
        expect(next.validPosition).toEqual(1);
      });
    });
    describe("timeshiftEnabled + ffEnabled + rwEnabled ContractRestrictions set", () => {
      it("should be able to scrub forward", () => {
        contractRestrictionGuardian = new ContractRestrictionsGuardian({
          timeshiftEnabled: true,
          ffEnabled: true,
          rwEnabled: true,
        });
        contractRestrictionGuardian.isValidPosition(1);
        const next = contractRestrictionGuardian.isValidPosition(25);
        expect(next.valid).toBe(true);
        expect(next.validPosition).toEqual(25);
      });
      it("should be able to scrub backward", () => {
        contractRestrictionGuardian = new ContractRestrictionsGuardian({
          timeshiftEnabled: true,
          ffEnabled: true,
          rwEnabled: true,
        });
        contractRestrictionGuardian.isValidPosition(25);
        const next = contractRestrictionGuardian.isValidPosition(1);
        expect(next.valid).toBe(true);
        expect(next.validPosition).toEqual(1);
      });
    });
  });
  describe("isAirPlayAllowed", () => {
    it("Should respond false if not set in ContractRestriction", () => {
      contractRestrictionGuardian = new ContractRestrictionsGuardian({});
      const isAirplayAllowed = contractRestrictionGuardian.isAirPlayAllowed();
      expect(isAirplayAllowed).toBe(false);
    });
    it("Should respond false if set false in ContractRestriction", () => {
      contractRestrictionGuardian = new ContractRestrictionsGuardian({
        airplayEnabled: false,
      });
      const isAirplayAllowed = contractRestrictionGuardian.isAirPlayAllowed();
      expect(isAirplayAllowed).toBe(false);
    });
    it("Should respond true if set true in ContractRestriction", () => {
      contractRestrictionGuardian = new ContractRestrictionsGuardian({
        airplayEnabled: true,
      });
      const isAirplayAllowed = contractRestrictionGuardian.isAirPlayAllowed();
      expect(isAirplayAllowed).toBe(true);
    });
  });
});
