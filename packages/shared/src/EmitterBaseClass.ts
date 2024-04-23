// SPDX-FileCopyrightText: 2024 Red Bee Media Ltd <https://www.redbeemedia.com/>
//
// SPDX-License-Identifier: MIT

import mitt, { Emitter, Handler, WildcardHandler } from "mitt";

type EventHelper<T> = { [K in keyof T]: { event: K; data: T[K] } };
export type AllEvent<T> = EventHelper<T>[keyof EventHelper<T>];

type AllEventHandler<T> = (event: AllEvent<T>) => void;

export class EmitterBaseClass<Events extends Record<string, unknown>> {
  private emitter?: Emitter<Events>;

  private allHandlers: Map<AllEventHandler<Events>, WildcardHandler<Events>> =
    new Map();

  constructor() {
    this.emitter = mitt();
  }

  protected emit<Key extends keyof Events>(
    event: Key,
    data: Events[Key]
  ): void {
    if (!this.emitter) {
      console.warn("[EmitterBaseClass] trying to emit on destroyed emitter");
      return;
    }
    this.emitter.emit(event, data);
  }

  public once<Key extends keyof Events>(
    event: Key,
    handler: Handler<Events[Key]>
  ): void {
    const fn = (data: Events[Key]) => {
      this.emitter?.off(event, fn);
      handler(data);
    };

    this.emitter?.on(event, fn);
  }

  public on<Key extends keyof Events>(
    event: Key,
    handler: Handler<Events[Key]>
  ): void {
    this.emitter?.on(event, handler);
  }

  public onAll(handler: AllEventHandler<Events>): void {
    const allHandler: WildcardHandler<Events> = (event, data) => {
      handler({
        event,
        data,
      });
    };
    if (this.allHandlers.has(handler)) {
      this.offAll(handler);
    }
    this.allHandlers.set(handler, allHandler);
    this.emitter?.on("*", allHandler);
  }

  // public onAllTest();

  public off<Key extends keyof Events>(
    event: Key,
    handler?: Handler<Events[Key]>
  ): void {
    this.emitter?.off(event, handler);
  }

  public offAll(handler: AllEventHandler<Events>): void {
    const allHandler = this.allHandlers.get(handler);
    if (allHandler) {
      this.emitter?.off("*", allHandler);
    } else {
      console.warn(
        "[EmitterBaseClass] trying to remove non-existing all handler"
      );
    }
  }

  public addEventListener<Key extends keyof Events>(
    event: Key,
    handler: Handler<Events[Key]>
  ): void {
    this?.on(event, handler);
  }

  public removeEventListener<Key extends keyof Events>(
    event: Key,
    handler?: Handler<Events[Key]>
  ): void {
    this?.off(event, handler);
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars, no-unused-vars
  public destroy(_?: any): void {
    this.emitter?.off("*");
    this.emitter = undefined;
  }
}
