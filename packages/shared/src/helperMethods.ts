// SPDX-FileCopyrightText: 2024 Red Bee Media Ltd <https://www.redbeemedia.com/>
//
// SPDX-License-Identifier: MIT

import { TIFAType } from "./interfaces/common";

export const clamp = (num: number, clamp: number, higher: number) =>
  higher ? Math.min(Math.max(num, clamp), higher) : Math.min(num, clamp);

export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait = 500
) => {
  // Only way to type declare for both browsers and Node
  let timeout: ReturnType<typeof setTimeout>;
  return function (...args: Parameters<T>) {
    clearTimeout(timeout);
    timeout = setTimeout(() => {
      func(...args);
    }, wait);
  };
};

export const stringToArray = (string: string) => {
  const buffer = new ArrayBuffer(string.length * 2); // 2 bytes for each char
  const array = new Uint16Array(buffer);
  for (let i = 0, strLen = string.length; i < strLen; i++) {
    array[i] = string.charCodeAt(i);
  }
  return array;
};

export const arrayToString = (array: ArrayBuffer): string => {
  const uint16array = new Uint16Array(array);
  return String.fromCharCode.apply(null, uint16array as any);
};

export const stringToUUID = (input: string): string => {
  if (input.length == 32) {
    const p1 = input.slice(0, 8);
    const p2 = input.slice(8, 12);
    const p3 = input.slice(12, 16);
    const p4 = input.slice(16, 20);
    const p5 = input.slice(20);
    return `${p1}-${p2}-${p3}-${p4}-${p5}`;
  }
  // Assuming we already have a UUID string
  return input;
};

export const base64DecodeUint8Array = (input: any) => {
  const raw = window.atob(input);
  const rawLength = raw.length;
  const array = new Uint8Array(new ArrayBuffer(rawLength));

  for (let i = 0; i < rawLength; i++) {
    array[i] = raw.charCodeAt(i);
  }

  return array;
};

export const base64EncodeUint8Array = (input: any) => {
  const keyStr =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
  let output = "";
  let chr1, chr2, chr3, enc1, enc2, enc3, enc4;
  let i = 0;

  while (i < input.length) {
    chr1 = input[i++];
    chr2 = i < input.length ? input[i++] : Number.NaN; // Not sure if the index
    chr3 = i < input.length ? input[i++] : Number.NaN; // checks are needed here

    enc1 = chr1 >> 2;
    enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
    enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
    enc4 = chr3 & 63;

    if (isNaN(chr2)) {
      enc3 = enc4 = 64;
    } else if (isNaN(chr3)) {
      enc4 = 64;
    }
    output +=
      keyStr.charAt(enc1) +
      keyStr.charAt(enc2) +
      keyStr.charAt(enc3) +
      keyStr.charAt(enc4);
  }
  return output;
};

export const getUUID = (): string => {
  return [
    generateS4(),
    generateS4(),
    "-",
    generateS4(),
    "-",
    generateS4(),
    "-",
    generateS4(),
    "-",
    generateS4(),
    generateS4(),
    generateS4(),
  ].join("");
};

const DUID_STORAGE_KEY = "deviceId";

/**
 * Get device ID either from sessionToken or generated using getUUID(), the generated one will be stored in localStorage
 */
export const getDeviceId = (sessionToken?: string): string => {
  if (sessionToken) {
    const parts = sessionToken.split("|");
    return parts[7];
  }

  const storedDeviceId = localStorage.getItem(DUID_STORAGE_KEY);
  if (storedDeviceId) {
    return storedDeviceId;
  }

  const deviceId = getUUID();

  try {
    localStorage.setItem(DUID_STORAGE_KEY, deviceId);
  } catch (e) {
    // no-op
  }
  return deviceId;
};

/**
 * Get a Identifier for Advertising
 */
export const getSessionIFA = (): { ifa: string; ifaType: TIFAType } => {
  const ifa = getUUID();
  return {
    ifa,
    ifaType: "sessionid",
  };
};

const generateS4 = () => {
  return Math.floor((1 + Math.random()) * 0x10000)
    .toString(16)
    .substring(1);
};
