// SPDX-FileCopyrightText: 2024 Red Bee Media Ltd <https://www.redbeemedia.com/>
//
// SPDX-License-Identifier: MIT

/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  getBrowser,
  getBrowserVersion,
  getOS,
  isAppleSafari,
  isBrowserSupported,
  isLGTV,
  isSamsungTV,
} from "./common";

const UserAgents = {
  windows:
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/88.0.4324.182 Safari/537.36",
  macOS:
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36",
  linux:
    "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36",
  iOS: "Mozilla/5.0 (iPhone; CPU iPhone OS 16_4 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.0 Mobile/15E148 Safari/604.1",
  ipadOS:
    "Safari: Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.0 Safari/605.1.15",
  android:
    "Mozilla/5.0 (Linux; Android 10; Pixel 3 XL) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/88.0.4324.182 Safari/537.36",
  chrome:
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/88.0.4324.182 Safari/537.36",
  chromeIphone:
    "Mozilla/5.0 (iPhone; CPU iPhone OS 16_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) CriOS/111.0.5563.101 Mobile/15E148 Safari/604.1",
  firefox:
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:109.0) Gecko/20100101 Firefox/111.0",
  firefoxIphone:
    "Mozilla/5.0 (iPhone; CPU iPhone OS 13_2_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) FxiOS/111.0 Mobile/15E148 Safari/605.1.15",
  edge: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/88.0.4324.182 Safari/537.36 Edg/88.0.705.74",
  edgeAndroid:
    "Mozilla/5.0 (Linux; Android 10; Pixel 3 XL) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/88.0.4324.182 Safari/537.36 EdgA/88.0.705.74",
  safari:
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 11_2_3) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.0.3 Safari/605.1.15",
  unsupportedChrome:
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4324.182 Safari/537.36",
  samsung2020:
    "Mozilla/5.0 (SMART-TV; LINUX; Tizen 5.5) AppleWebKit/537.36 (KHTML, like Gecko) 69.0.3497.106.1/5.5 TV Safari/537.36",
  samsung2017:
    "Mozilla/5.0 (SMART-TV; LINUX; Tizen 3.0) AppleWebKit/538.1 (KHTML, like Gecko) Version/3.0 TV Safari/538.1",
  samsung2016:
    "Mozilla/5.0 (SMART-TV; Linux; Tizen 2.4.0) AppleWebKit/538.1 (KHTML, like Gecko) Version/2.4.0 TV Safari/538.1",
  lg2017:
    "Mozilla/5.0 (Web0S; Linux/SmartTV) AppleWebKit/537.36 (KHTML, like Gecko) QtWebEngine/5.2.1 Chrome/38.0.2125.122 Safari/537.36 WebAppManager",
  lg2016:
    "Mozilla/5.0 (Web0S; Linux/SmartTV) AppleWebKit/538.2 (KHTML, like Gecko) Large Screen WebAppManager Safari/538.2",
};

const UnsupportedUserAgents = ["linux", "edgeAndroid", "unsupportedChrome"];

function setUserAgent(userAgent: keyof typeof UserAgents) {
  Object.defineProperty(window.navigator, "userAgent", {
    value: UserAgents[userAgent],
    writable: true,
  });
}

function setTouchable(touchable: boolean) {
  if (touchable) {
    Object.defineProperty(document.documentElement, "ontouchstart", {
      value: () => ({}),
      writable: true,
      configurable: true,
    });
  } else {
    delete document.documentElement.ontouchstart;
  }
}

describe("device -> common", () => {
  describe("isLGTV", () => {
    it("detects lg tv when the webos libaries are loaded", () => {
      (window as any).webOS = {
        platform: {
          tv: true,
        },
      };
      expect(isLGTV()).toBe(true);
    });

    it("does not detect lg if the webos libraries are NOT loaded", () => {
      (window as any).webOS = undefined;
      expect(isLGTV()).toBe(false);
    });
  });

  describe("isSamsungTV", () => {
    it("detects samsung tv when the tizen and webapis libaries are loaded", () => {
      (window as any).tizen = {};
      (window as any).webapis = {};
      expect(isSamsungTV()).toBe(true);
    });

    it("does not detect samsung if the tizen and webapis libraries are NOT loaded", () => {
      (window as any).tizen = undefined;
      (window as any).webapis = undefined;
      expect(isSamsungTV()).toBe(false);
    });
  });

  describe("getOS", () => {
    it("detects windows", () => {
      setUserAgent("windows");
      expect(getOS()).toBe("Windows");
    });

    it("detects iPadOS", () => {
      setTouchable(true);
      setUserAgent("ipadOS");
      expect(getOS()).toBe("iPadOS");
      setTouchable(false);
    });

    it("detects macOS", () => {
      setUserAgent("macOS");
      expect(getOS()).toBe("macOS");
    });

    it("detects Linux", () => {
      setUserAgent("linux");
      expect(getOS()).toBe("Linux");
    });

    it("detects iOS", () => {
      setUserAgent("iOS");
      expect(getOS()).toBe("iOS");
    });

    it("detects Android", () => {
      setUserAgent("android");
      expect(getOS()).toBe("Android");
    });
  });

  describe("getBrowser", () => {
    it("detects Chrome", () => {
      setUserAgent("chrome");
      expect(getBrowser()).toBe("chrome");
    });

    it("detects Safari", () => {
      setUserAgent("safari");
      expect(getBrowser()).toBe("safari");
    });

    it("detects Firefox", () => {
      setUserAgent("firefox");
      expect(getBrowser()).toBe("firefox");
    });

    it("detects Edge", () => {
      setUserAgent("edge");
      expect(getBrowser()).toBe("edge");
    });

    it("detects Edge on android", () => {
      setUserAgent("edgeAndroid");
      expect(getBrowser()).toBe("edge");
    });
  });

  describe("getBrowserVersion", () => {
    it("detects Chrome version", () => {
      setUserAgent("chrome");
      expect(getBrowserVersion()).toBe(88);
    });

    it("detects Safari version", () => {
      setUserAgent("safari");
      expect(getBrowserVersion()).toBe(14);
    });

    it("detects Firefox version", () => {
      setUserAgent("firefox");
      expect(getBrowserVersion()).toBe(111);
    });

    it("detects Edge version", () => {
      setUserAgent("edge");
      expect(getBrowserVersion()).toBe(88);
    });

    it("detects Edge on android version", () => {
      setUserAgent("edgeAndroid");
      expect(getBrowserVersion()).toBe(88);
    });
  });
  describe("isAppleSafari", () => {
    it("detects Apple Safari when using Safari on iPhone", () => {
      setUserAgent("safari");
      expect(isAppleSafari()).toBe(true);
    });

    it("detects Apple Safari when using Chrome on iphone", () => {
      setUserAgent("chromeIphone");
      expect(isAppleSafari()).toBe(true);
    });

    it("detects Apple Safari when using Firefox on iphone", () => {
      setUserAgent("firefoxIphone");
      expect(isAppleSafari()).toBe(true);
    });
  });
  describe("isBrowserSupported", () => {
    it("Detects Samsung TV 2017 as supported", () => {
      (window as any).tizen = {};
      (window as any).webapis = {};
      setUserAgent("samsung2017");
      expect(isBrowserSupported()).toBe(true);

      (window as any).tizen = undefined;
      (window as any).webapis = undefined;
    });

    it("Detects Samsung TV 2020 as supported", () => {
      (window as any).tizen = {};
      (window as any).webapis = {};
      setUserAgent("samsung2020");
      expect(isBrowserSupported()).toBe(true);

      (window as any).tizen = undefined;
      (window as any).webapis = undefined;
    });

    it("Detects Samsung TV 2016 as unsupported", () => {
      (window as any).tizen = {};
      (window as any).webapis = {};
      setUserAgent("samsung2016");

      expect(isBrowserSupported()).toBe(false);

      (window as any).tizen = undefined;
      (window as any).webapis = undefined;
    });

    it("Detects LG WebOS TV 2017 as supported", () => {
      (window as any).webOS = {
        platform: {
          tv: true,
        },
      };
      setUserAgent("lg2017");

      expect(isBrowserSupported()).toBe(true);

      (window as any).webOS = undefined;
    });

    it("Detects LG WebOS TV 2016 as unsupported", () => {
      (window as any).webOS = {
        platform: {
          tv: true,
        },
      };
      setUserAgent("lg2016");

      expect(isBrowserSupported()).toBe(false);

      (window as any).webOS = undefined;
    });

    const {
      samsung2016,
      samsung2017,
      samsung2020,
      lg2017,
      lg2016,
      ...userAgents
    } = UserAgents;

    Object.keys(userAgents).forEach((_userAgent) => {
      const userAgent = _userAgent as keyof typeof UserAgents;
      if (UnsupportedUserAgents.includes(userAgent)) {
        it(`Detects: ${userAgent} as NOT supported`, () => {
          setUserAgent(userAgent);
          expect(isBrowserSupported()).toBe(false);
        });
      } else {
        it(`Detects: ${userAgent} as supported`, () => {
          setUserAgent(userAgent);
          expect(isBrowserSupported()).toBe(true);
        });
      }
    });
  });
});
