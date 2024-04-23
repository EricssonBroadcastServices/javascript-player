// SPDX-FileCopyrightText: 2024 Red Bee Media Ltd <https://www.redbeemedia.com/>
//
// SPDX-License-Identifier: MIT

import { XMLParser } from "fast-xml-parser";

import {
  IAdDataRepresentation,
  TrackingEvent,
} from "@ericssonbroadcastservices/js-player-shared";

const xmlParser = new XMLParser({
  ignoreAttributes: false,
  allowBooleanAttributes: true,
  parseAttributeValue: true,
  alwaysCreateTextNode: true,
});

interface ITracking {
  "@_event": TrackingEvent;
  "#text": string;
}

interface IVastRepresentation {
  "@_id": string;
  InLine: {
    AdSystem: {
      "#text": string;
    };
    AdTitle: {
      "#text": string;
    };
    Impression: string[];
    Creatives: {
      Creative: {
        Linear: {
          Duration: {
            "#text": string;
          };
          TrackingEvents: {
            Tracking: ITracking[];
          };
        };
      };
    };
  };
}

type TrackingMap = { [key in TrackingEvent]?: string[] };

function parseImpression(impression: any): string[] {
  if (Array.isArray(impression)) {
    return impression.map((value) => value["#text"]);
  } else if (impression?.["#text"]) {
    return [impression["#text"]];
  }
  return [];
}

function getTrackingMap(events: ITracking[]): TrackingMap {
  const trackingMap: TrackingMap = {};
  events.forEach((tracking) => {
    const evtArray = trackingMap[tracking["@_event"]];
    if (!evtArray) {
      trackingMap[tracking["@_event"]] = [tracking["#text"]];
    } else {
      evtArray.push(tracking["#text"]);
    }
  });
  return trackingMap;
}

export function parseVAST(xml: string, idPrefix = ""): IAdDataRepresentation[] {
  const ads: IAdDataRepresentation[] = [];
  const json = xmlParser.parse(xml);
  if (json?.VAST?.Ad) {
    const adVasts: any[] = Array.isArray(json.VAST.Ad)
      ? json.VAST.Ad
      : [json.VAST.Ad];
    adVasts.forEach((vastRepresentation: IVastRepresentation, index) => {
      const InLine = vastRepresentation.InLine;
      const LinearAd = InLine?.Creatives?.Creative?.Linear;
      const Tracking = LinearAd?.TrackingEvents?.Tracking;

      const impression = parseImpression(InLine?.Impression);
      const trackingMap = getTrackingMap(Tracking);

      const adId =
        vastRepresentation["@_id"] ||
        `title:${InLine?.AdTitle["#text"]},system:${InLine?.AdSystem["#text"]}`;

      const adDataRepresentation: IAdDataRepresentation = {
        id: `${idPrefix}_${index}_${adId}`,
        system: InLine?.AdSystem["#text"],
        title: InLine?.AdTitle["#text"],
        duration: new Date(
          `1970-01-01T${LinearAd?.Duration["#text"]}.000Z`
        ).getTime(),
        trackingEvents: {
          impression: impression || [],
          ...trackingMap,
        },
      };
      ads.push(adDataRepresentation);
    });
  }
  return ads;
}
