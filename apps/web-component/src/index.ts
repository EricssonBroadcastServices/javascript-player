// SPDX-FileCopyrightText: 2024 Red Bee Media Ltd <https://www.redbeemedia.com/>
//
// SPDX-License-Identifier: MIT

import "@ericssonbroadcastservices/js-player-web-component";

const wrapper = document.querySelector<HTMLElement>("#web-component-wrapper");
const input = document.querySelector<HTMLInputElement>(
  'input[name="assetpage"]'
);

const searchParams = new URL(window.location.href).searchParams;

if (input) {
  input.value =
    searchParams.get("assetpage") ??
    "https://sdktesting.redbee.dev/asset/TearsOfSteel_UHD_35FC49";
}

function createComponent() {
  if (wrapper && input) {
    wrapper.innerHTML = "";
    const playerComponent = document.createElement("redbee-player");
    playerComponent.setAttribute("analytics-disable", "true");
    playerComponent.setAttribute("autoplay", "false");
    playerComponent.setAttribute("assetpage", input.value);
    wrapper?.appendChild(playerComponent);
  }
}

createComponent();

input?.addEventListener("change", createComponent);
