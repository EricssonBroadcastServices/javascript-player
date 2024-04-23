// SPDX-FileCopyrightText: 2024 Red Bee Media Ltd <https://www.redbeemedia.com/>
//
// SPDX-License-Identifier: MIT

interface IWidget {
  id?: string;
  url: string;
}

interface IWidgetManagerInstance {
  wrapperElement: HTMLElement;
  widgets: IWidget[];
}

export class OverlayWidgetManager {
  private widgetManagerInstance: IWidgetManagerInstance;

  constructor({ wrapperElement }: { wrapperElement: HTMLElement }) {
    this.widgetManagerInstance = {
      widgets: [],
      wrapperElement,
    };
  }

  addWidget({ url }: IWidget): void {
    if (!url) return;
    const widgetId = `widget${this.widgetManagerInstance.widgets.length + 1}`;
    this.widgetManagerInstance.widgets.push({
      id: widgetId,
      url,
    });

    const widgetContainer = document.createElement("iframe");
    widgetContainer.id = widgetId;
    widgetContainer.src = url;

    widgetContainer.style.height = "100%";
    widgetContainer.style.width = "100%";

    widgetContainer.style.left = "0px";
    widgetContainer.style.top = "0px";
    widgetContainer.style.position = "absolute";

    widgetContainer.style.transform = "scale(1.0)";
    widgetContainer.style.transformOrigin = "left top";

    widgetContainer.style.border = "none";
    widgetContainer.setAttribute("scrolling", "no");
    this.widgetManagerInstance.wrapperElement.appendChild(widgetContainer);
  }

  removeWidget({ url }: { url: string }): void {
    const widgetIdx = this.widgetManagerInstance.widgets.findIndex(
      (w) => w.url === url
    );
    const widget = this.widgetManagerInstance.widgets[widgetIdx];
    document.querySelector(`#${widget.id}`)?.remove();
    delete this.widgetManagerInstance.widgets[widgetIdx];
  }

  destroy() {
    this.widgetManagerInstance.widgets.forEach((widget) => {
      this.removeWidget({ url: widget.url });
    });
  }
}
