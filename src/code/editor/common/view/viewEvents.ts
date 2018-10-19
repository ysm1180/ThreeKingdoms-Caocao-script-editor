/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { IConfigurationChangedEvent } from '../config/editorOptions';
import { Disposable, IDisposable } from '../../../base/common/lifecycle';
import { ScrollEvent } from '../../../base/common/scroll';

export const enum ViewEventType {
    ConfigurtionChanged = 1,
    ScrollChanged = 2,
}

export class ViewConfigurationChangedEvent {
    public readonly type = ViewEventType.ConfigurtionChanged;

    public readonly layoutInfo: boolean;

    constructor(source: IConfigurationChangedEvent) {
        this.layoutInfo = source.layoutInfo;
    }
}


export class ViewScrollChangedEvent {
    public readonly type = ViewEventType.ScrollChanged;

    public readonly scrollWidth: number;
    public readonly scrollLeft: number;
    public readonly scrollHeight: number;
    public readonly scrollTop: number;

    public readonly scrollWidthChanged: boolean;
    public readonly scrollLeftChanged: boolean;
    public readonly scrollHeightChanged: boolean;
    public readonly scrollTopChanged: boolean;

    constructor(source: ScrollEvent) {
        this.scrollWidth = source.scrollWidth;
        this.scrollLeft = source.scrollLeft;
        this.scrollHeight = source.scrollHeight;
        this.scrollTop = source.scrollTop;

        this.scrollWidthChanged = source.scrollWidthChanged;
        this.scrollLeftChanged = source.scrollLeftChanged;
        this.scrollHeightChanged = source.scrollHeightChanged;
        this.scrollTopChanged = source.scrollTopChanged;
    }
}


export type ViewEvent = (
    ViewConfigurationChangedEvent |
    ViewScrollChangedEvent
);

export class ViewEventsCollector {
    private _events: ViewEvent[];
    private _eventsLen = 0;

    constructor() {
        this._events = [];
        this._eventsLen = 0;
    }

    public emit(event: ViewEvent) {
        this._events[this._eventsLen++] = event;
    }

    public finalize(): ViewEvent[] {
        let result = this._events;
        this._events = null;
        return result;
    }

}

export interface IViewEventListener {
    (events: ViewEvent[]): void;
}

export class ViewEventEmitter extends Disposable {
    private _listeners: IViewEventListener[];
    private _collector: ViewEventsCollector;
    private _collectorCnt: number;

    constructor() {
        super();
        this._listeners = [];
        this._collector = null;
        this._collectorCnt = 0;
    }

    public dispose(): void {
        this._listeners = [];
        super.dispose();
    }

    protected _beginEmit(): ViewEventsCollector {
        this._collectorCnt++;
        if (this._collectorCnt === 1) {
            this._collector = new ViewEventsCollector();
        }
        return this._collector;
    }

    protected _endEmit(): void {
        this._collectorCnt--;
        if (this._collectorCnt === 0) {
            const events = this._collector.finalize();
            this._collector = null;
            if (events.length > 0) {
                this._emit(events);
            }
        }
    }

    private _emit(events: ViewEvent[]): void {
        const listeners = this._listeners.slice(0);
        for (let i = 0, len = listeners.length; i < len; i++) {
            listeners[i](events);
        }
    }

    public addEventListener(listener: (events: ViewEvent[]) => void): IDisposable {
        this._listeners.push(listener);
        return {
            dispose: () => {
                let listeners = this._listeners;
                for (let i = 0, len = listeners.length; i < len; i++) {
                    if (listeners[i] === listener) {
                        listeners.splice(i, 1);
                        break;
                    }
                }
            }
        };
    }
}