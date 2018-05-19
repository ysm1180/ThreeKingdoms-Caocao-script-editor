type Listener<T> = (e: T) => any;

export class ChainEventStorage<T> {
    private _relayEvent: RelayEvent<T>;
    private pendingEvents: Event<T>[] = [];
    private on = false;

    constructor() {
        this._relayEvent = null;
    }

    public set(event: RelayEvent<T>) {
        this._relayEvent = event;
        this.on = true;
    }

    public add(event: Event<T>) {
        if (!this.on) {
            this.pendingEvents.push(event);
        } else {
            if (this.pendingEvents.length) {
                this.pendingEvents.forEach((e) => {
                    e.add(this._relayEvent.listener, this._relayEvent.thisArg);
                });
                this.pendingEvents = [];
            }

            event.add(this._relayEvent.listener, this._relayEvent.thisArg);
        }
    }
}


export class Event<T> {
    private _listeners: (Function | [Function, any])[] = [];

    constructor() {

    }

    public get listener(): Listener<T> {
        return (e: T) => {
            this.fire(e);
        };
    }

    public add(listener: Listener<T>, thisArg?: any) {
        this._listeners.push(thisArg ? [listener, thisArg] : listener);
    }

    public fire(event?: T) {
        if (this._listeners) {
            const queue: [(Function | [Function, any]), T][] = [];

            for (let i = 0; i < this._listeners.length; i++) {
                queue.push([this._listeners[i], event]);
            }

            while (queue.length > 0) {
                const [listener, event] = queue.shift();
                if (typeof listener === 'function') {
                    listener.call(undefined, event);
                } else {
                    listener[0].call(listener[1], event);
                }
            }
        }
    }
}

export class RelayEvent<T> {
    public listener: Listener<T>;
    public thisArg: any;

    constructor() {

    }

    public set(listener: Listener<T>, thisArg?: any) {
        this.listener = listener;
        this.thisArg = thisArg;
    }

}