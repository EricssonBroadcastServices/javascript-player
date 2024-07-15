// SPDX-FileCopyrightText: 2024 Red Bee Media Ltd <https://www.redbeemedia.com/>
//
// SPDX-License-Identifier: MIT

import "formdata-polyfill";
import "core-js/actual";
import "whatwg-fetch";

import qrCode from "qrcode";

import {
  IRedBeePlayerOptions,
  RedBeePlayer,
} from "@ericssonbroadcastservices/javascript-player";
import {
  ExposureService,
  ILoadOptions,
  PlayerCore,
} from "@ericssonbroadcastservices/js-player-core";
import {
  LogLevel,
  PlayerEvents,
  PlayerEventsMap,
  debounce,
  getAssetTitle,
} from "@ericssonbroadcastservices/js-player-shared";

import { customerPortalPlayer } from "./useCases/customerPortalPlayer";
import { defaultPlayer } from "./useCases/defaultPlayer";

const castApps: Record<string, string> = {
  Production: "F40E2D17",
  "Pre-stage": "8A71C1D4",
};

const url = new URL(location.href);
const qs = document.querySelector.bind(document);

const $form = qs(".playback-form") as HTMLFormElement;
const $assetTypeSelect = qs("#assetType") as HTMLSelectElement;
const $sourcesDatalist = qs("#sources") as HTMLDataListElement;
const $cuDatalist = qs("#customersList") as HTMLDataListElement;
const $buDatalist = qs("#businessUnitsList") as HTMLDataListElement;
const $castAppsDatalist = qs("#castApps") as HTMLDataListElement;
const $loadButton = qs("#load-button") as HTMLButtonElement;
const $destroyButton = qs("#destroy-player") as HTMLButtonElement;
const $utcTimeInput = qs("#utcTime") as HTMLInputElement;
const $qrCodeCanvas = qs("#qr") as HTMLCanvasElement;
const $logsContainer = qs("#player-logs") as HTMLElement; // HTMLCodeElement doesn't exist
const $wrapper = document.querySelector("div#video-wrapper") as HTMLDivElement;
const $eventSubscriptions = qs("#eventSubscriptions") as HTMLSelectElement;
const $loginButton = qs("#login-button") as HTMLInputElement;
const $loginDialog = qs("#login-dialog") as HTMLDialogElement;
const $loginForm = qs("#login-dialog form") as HTMLFormElement;
const $rememberAuthCheckbox = qs("#storeAuth") as HTMLInputElement;

document.addEventListener("DOMContentLoaded", init);

let player: PlayerCore | RedBeePlayer;
let cleanup: () => void;

function updateQRCode() {
  qrCode.toCanvas($qrCodeCanvas, window.location.href);
}

function dedupStrings(strings: string[]) {
  return [...new Set(strings)];
}

function updateDataList(
  datalist: HTMLDataListElement,
  options: [string, string][]
) {
  datalist.innerHTML = "";
  options.forEach(([textContent, value]) => {
    datalist.appendChild(
      Object.assign(document.createElement("option"), { textContent, value })
    );
  });
}

function updateCastAppDatalist() {
  const castHistory: string[] = JSON.parse(localStorage.castAppHistory || "[]");
  const castHistoryEntries = castHistory.map((appId): [string, string] => [
    `Custom app: ${appId}`,
    appId,
  ]);
  updateDataList($castAppsDatalist, [
    ...Object.entries(castApps),
    ...castHistoryEntries,
  ]);
}

// Auth and asset both need to update when you change the CU/BU
function onContentChange(event?: Event) {
  // Unset dependant fields
  if (event?.target === $form.env) {
    $form.cu.value = "";
    $form.bu.value = "";
  } else if (event?.target === $form.cu) {
    $form.bu.value = "";
  }

  updateAuthDataList();
  updateAssetList();
  const source = $form.source.value;
  // require cu/bu if the source is not a URL
  [$form.cu, $form.bu].forEach(
    (input: HTMLInputElement) => (input.required = !source.includes("://"))
  );
}

function updateAuthDataList() {
  const { customer, businessUnit, exposureBaseUrl } = getPlayerOptions();
  const authHistory = JSON.parse(localStorage.authHistory || "{}");
  const path = `${exposureBaseUrl}/${customer}/${businessUnit}`;
  const sessionToken: string = authHistory[path] || "";
  // update/unset session token, unless it's not in history (which means the user manually entered it)
  if (
    !$form.sessionToken.value ||
    Object.values(authHistory).includes($form.sessionToken.value)
  ) {
    $form.sessionToken.value = sessionToken;
  }
}

async function updateAssetList() {
  const { customer, businessUnit, exposureBaseUrl } = getPlayerOptions();

  // Populate CU/BU lists from history
  let assets: Record<string, string> = {};
  let cuListOptions: [string, string][] = [];
  let buListOptions: [string, string][] = [];
  if (localStorage.assetHistory) {
    const history =
      JSON.parse(localStorage.assetHistory)?.[exposureBaseUrl] || {};
    cuListOptions = Object.keys(history).map((cu) => [cu, cu]);
    if (customer && history[customer]) {
      buListOptions = Object.keys(history[customer]).map((bu) => [bu, bu]);
      if (businessUnit) {
        assets = history[customer][businessUnit] || {};
      }
    }
  }
  updateDataList($cuDatalist, cuListOptions);
  updateDataList($buDatalist, buListOptions);
  if (customer && businessUnit) {
    try {
      const url = `${exposureBaseUrl}/v1/customer/${customer}/businessunit/${businessUnit}/content/asset?pageSize=200&assetType=${$assetTypeSelect.value}`;
      const response = await fetch(url);
      if (response.ok) {
        const items = (await response.json()).items || [];
        items.forEach((asset: any) => {
          assets[asset?.assetId] = asset?.localized[0]?.title;
        });
      }
    } catch (err) {}
  } else if (localStorage.sourceHistory) {
    // if no cu or no bu, add URL source history to list
    JSON.parse(localStorage.sourceHistory).forEach((source: string) => {
      assets[source] = source;
    });
  }
  updateDataList(
    $sourcesDatalist,
    Object.entries(assets).map(([id, title]) => [title, id])
  );
}

export function updateLogs(
  evt: string,
  data: PlayerEventsMap[keyof PlayerEventsMap],
  startTime: number,
  severity: "info" | "warn" | "error"
) {
  if (severity === "error") {
    console.error(`eventType: ${evt}`, data, Date.now() - startTime);
  } else if (severity === "warn") {
    console.warn(`eventType: ${evt}`, data, Date.now() - startTime);
  } else {
    console.log(`eventType: ${evt}`, data, Date.now() - startTime);
  }
  const hr = document.createElement("hr");
  const div = document.createElement("div");
  const log = document.createTextNode(
    `eventType: ${evt} Data: ${JSON.stringify(data, null, 2)} Timestamp: ${
      Date.now() - startTime
    }`
  );

  div.setAttribute("id", severity);
  div.appendChild(log);
  $logsContainer.appendChild(div);
  $logsContainer.appendChild(hr);
}

function getFilteredFormEntries(): string[][] {
  // need the "as string" because FormDataEntryValue can also be File, but we know it's not
  return Array.from(new FormData($form))
    .filter(([, val]) => val)
    .map(([name, val]) => [name, val as string]);
}

function getPlayerOptions(): IRedBeePlayerOptions {
  const data = Object.fromEntries(getFilteredFormEntries());

  window.__RED_BEE_MEDIA__ = {
    supportedFormats: data.format ? [data.format.toUpperCase()] : undefined,
    preferredFormats: data.format ? [data.format.toLowerCase()] : undefined,
    engine: data.engine ?? undefined,
  };

  return {
    customer: data.cu,
    businessUnit: data.bu,
    exposureBaseUrl: data.env,
    castAppId: data.castAppId || castApps.Production,
    debug: data.analytics !== "true",
    sessionToken: data.sessionToken,
    autoplay: data.autoplay === "true",
    wrapperElement: $wrapper,
    logLevel: LogLevel.DEBUG,
    keysystem: data.keySystem,
  };
}

export function getLoadOptions(): ILoadOptions {
  const data = Object.fromEntries(getFilteredFormEntries());
  const { source, startTime, start, end, domain, pageUrl, consent, ssaiCustomParams } = data;

  return {
    source,
    ...(startTime && { startTime }),
    ...((start || end) && {
      manifest: {
        ...(start && { start }),
        ...(end && { end }),
      },
    }),
    ...((domain || pageUrl || consent || ssaiCustomParams) && {
      ads: {
        ...(domain && { domain }),
        ...(pageUrl && { pageUrl }),
        ...(consent && { consent }),
        ...(ssaiCustomParams && Object.fromEntries((new URLSearchParams(ssaiCustomParams)).entries()))
      }
    })
  };
}

function loadHandler(playerInstance: PlayerCore | RedBeePlayer) {
  player = playerInstance;

  // Update play history
  const { castAppId, customer, businessUnit, exposureBaseUrl, sessionToken } =
    getPlayerOptions();
  const source = $form.source.value;
  if (castAppId && !Object.values(castApps).includes(castAppId)) {
    const history: string[] = JSON.parse(localStorage.castAppHistory || "[]");
    localStorage.setItem(
      "castAppHistory",
      JSON.stringify(dedupStrings([castAppId, ...history]))
    );
  }

  if (source.includes("://")) {
    const history: string[] = JSON.parse(localStorage.sourceHistory || "[]");
    localStorage.setItem(
      "sourceHistory",
      JSON.stringify(dedupStrings([source, ...history]))
    );
  } else {
    const history = JSON.parse(localStorage.assetHistory || "{}");
    const CUHistory = history[exposureBaseUrl] || {};
    const BUHistory = CUHistory[customer] || {};
    let assetHistory = BUHistory[businessUnit] || {};

    delete assetHistory[source];

    const asset = player.getAssetInfo();
    const lang = player.getSession()?.locale ?? "en";
    let title = "";
    if (asset) {
      title = getAssetTitle(asset, lang) ?? "";
    }
    assetHistory = {
      [source]: title || source,
      ...assetHistory,
    };

    BUHistory[businessUnit] = assetHistory;
    CUHistory[customer] = BUHistory;
    history[exposureBaseUrl] = CUHistory;
    localStorage.setItem("assetHistory", JSON.stringify(history));
    if ($rememberAuthCheckbox.checked) {
      const keyHistory: Record<string, string> = JSON.parse(
        localStorage.authHistory || "{}"
      );
      const authHistoryPath = `${exposureBaseUrl}/${customer}/${businessUnit}`;
      Object.assign(keyHistory, { [authHistoryPath]: sessionToken });
      localStorage.setItem("authHistory", JSON.stringify(keyHistory));
      updateAuthDataList();
    }
  }
}

export function isSubscribedEvent(event: PlayerEvents) {
  for (const option of $eventSubscriptions.selectedOptions) {
    if (option.value === event) {
      return true;
    }
  }
  return false;
}

export async function init() {
  $form.addEventListener("input", () => {
    const params = new URLSearchParams(getFilteredFormEntries());

    window.history.replaceState(
      null,
      "",
      `${location.origin}${location.pathname}?${params}`
    );
    updateQRCode();
  });

  $form.addEventListener("change", onContentChange);
  $form.addEventListener("input", debounce(onContentChange, 2000));

  const urlParams = Object.fromEntries(url.searchParams);

  Object.entries(urlParams).forEach(([name, value]) => {
    const element = $form[name];
    if (element?.type === "checkbox") {
      // Unchecked checkboxes won't be included in the URL any more.
      // value check is only needed for backwards compatibility.
      element.checked = value === "true";
    } else if (element) {
      element.value = value;
    }
  });

  // If we already have stored session tokens, default to storing future ones too
  $rememberAuthCheckbox.checked = !!localStorage.authHistory;

  updateCastAppDatalist();
  updateQRCode();
  onContentChange();

  $loginForm.addEventListener("submit", async () => {
    const {
      customer,
      businessUnit,
      exposureBaseUrl: baseUrl,
    } = getPlayerOptions();
    const { username, password } = Object.fromEntries(
      new FormData($loginForm)
    ) as Record<string, string>;

    const ctx = { customer, businessUnit, baseUrl };
    const { sessionToken } = await new ExposureService(ctx).authenticate({
      username,
      password,
    });
    $form["sessionToken"].value = sessionToken;
    // also trigger event to update query params
    $form.dispatchEvent(new Event("input"));
  });
  $loginButton.addEventListener("click", () => {
    $loginDialog.showModal();
  });
  $form.addEventListener("submit", async (evt) => {
    evt.preventDefault();
    cleanup?.();
    const options = getPlayerOptions();
    const isPortal = evt.submitter?.dataset?.variant === "portal";
    const source = $form.source.value;
    $logsContainer.innerHTML = "";
    console.log("[DEMO] Loading new player");
    if (!options.sessionToken) {
      console.log("[DEMO] Anonymous session to be set up");
    } else {
      console.log("[DEMO] Using supplied sessionToken");
    }
    if (isPortal) {
      cleanup = await customerPortalPlayer(source, options, loadHandler);
    } else {
      if (
        source.includes("://") &&
        (!options.customer || !options.businessUnit)
      ) {
        // As of RedBeePlayer v1.0.0 the player always needs a session token, so
        // customer and businessUnit are required parameters
        // To work around it so you can play source URLs without them for the demo,
        // we can hard code them and disable analytics
        Object.assign(options, {
          exposureBaseUrl: "https://exposure.api.redbee.dev",
          customer: "Players",
          businessUnit: "SDKTesting",
          debug: true,
        });
      }
      cleanup = await defaultPlayer(source, options, loadHandler);
    }

    document.querySelectorAll(".player-required").forEach((element) => {
      (element as HTMLInputElement).disabled = false;
    });
  });

  // close modals/dialogs when you click the backdrop
  document.addEventListener("click", (event) => {
    const dialog = event.target as HTMLDialogElement | null;
    if (dialog?.tagName === "DIALOG") {
      dialog.close();
    }
  });

  $destroyButton.addEventListener("click", (evt) => {
    evt.preventDefault();
    cleanup?.();
    $logsContainer.innerHTML = "";
    document.querySelectorAll(".player-required").forEach((element) => {
      (element as HTMLInputElement).disabled = true;
    });
  });

  $utcTimeInput.addEventListener("change", () => {
    const ms = $utcTimeInput.valueAsNumber;
    if (player && !isNaN(ms)) {
      const seekToUTCTime = new Date(new Date().setHours(0, 0, 0, ms));
      console.log("Seeking to UTC time", seekToUTCTime);
      player.seekToUTC(seekToUTCTime.getTime());
    }
  });

  Object.entries(PlayerEvents)
    .sort()
    .forEach(([name, value]) => {
      let selected = false;
      switch (value) {
        case PlayerEvents.STATE_CHANGED:
          return;
        case PlayerEvents.ENTITLEMENT_GRANTED:
        case PlayerEvents.PLAYER_SETUP_COMPLETED:
        case PlayerEvents.LOAD_START:
        case PlayerEvents.LOADED:
        case PlayerEvents.METADATA_EVENT:
        case PlayerEvents.ERROR:
        case PlayerEvents.DROPPED_FRAMES:
          selected = true;
          break;
      }
      const opt = document.createElement("option");
      opt.text = name;
      opt.value = value;
      opt.selected = selected;
      opt.onmousedown = (e) => {
        const scroll = $eventSubscriptions.scrollTop;
        e.preventDefault();
        opt.selected = !opt.selected;
        setTimeout(() => ($eventSubscriptions.scrollTop = scroll), 0);
        return false;
      };
      $eventSubscriptions.add(opt);
    });

  // Undocumented but useful parameters when testing on TV
  // TODO: When/If we create a demo page specifically for TV we can remove these
  if (urlParams.autoload === "true") {
    $loadButton.click();
    // fillscreen only make sense if autoload is true since you can't press load with it...
    if (urlParams.fillscreen === "true") {
      qs("#fullscreen-element")?.classList.add("fill");
    }
  }
}
