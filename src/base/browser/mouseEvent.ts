export interface IMouseEvent {
    readonly event: MouseEvent;
    readonly leftButton: boolean;
    readonly middleButton: boolean;
    readonly rightButton: boolean;
    readonly target: HTMLElement;
    readonly posx: number;
    readonly posy: number;
    readonly ctrlKey: boolean;
    readonly shiftKey: boolean;
    readonly altKey: boolean;

    preventDefault(): void;
    stopPropagation(): void;
}

export class StandardMouseEvent implements IMouseEvent {
    public readonly event: MouseEvent;

    public readonly leftButton: boolean;
    public readonly middleButton: boolean;
    public readonly rightButton: boolean;

    public readonly target: HTMLElement;

    public readonly posx: number;
    public readonly posy: number;
    public readonly ctrlKey: boolean;
    public readonly shiftKey: boolean;
    public readonly altKey: boolean;

    constructor(e: MouseEvent) {
        this.event = e;

        this.leftButton = e.button === 0;
        this.middleButton = e.button === 1;
        this.rightButton = e.button === 2;

        this.target = <HTMLElement>e.target;

        this.ctrlKey = e.ctrlKey;
        this.shiftKey = e.shiftKey;
        this.altKey = e.altKey;

        this.posx = e.pageX;
        this.posy = e.pageY;
    }

    public preventDefault(): void {
        this.event.preventDefault();
    }

    public stopPropagation(): void {
        this.event.stopPropagation();
    }
}

interface IWebKitMouseWheelEvent {
    wheelDeltaY: number;
    wheelDeltaX: number;
}

interface IGeckoMouseWheelEvent {
    HORIZONTAL_AXIS: number;
    VERTICAL_AXIS: number;
    axis: number;
    detail: number;
}

export class StandardMouseWheelEvent {
    public readonly event: MouseWheelEvent;
    public readonly deltaY: number;
    public readonly deltaX: number;
    public readonly target: Node;

    constructor(e: MouseWheelEvent, deltaX: number = 0, deltaY: number = 0) {
        this.event = e || null;
        this.target = e
            ? e.target || (<any>e).targetNode || e.srcElement
            : null;

        this.deltaY = deltaY;
        this.deltaX = deltaX;

        if (e) {
            let e1 = <IWebKitMouseWheelEvent>(<any>e);
            let e2 = <IGeckoMouseWheelEvent>(<any>e);

            // vertical delta scroll
            if (typeof e1.wheelDeltaY !== 'undefined') {
                this.deltaY = e1.wheelDeltaY / 120;
            } else if (
                typeof e2.VERTICAL_AXIS !== 'undefined' &&
                e2.axis === e2.VERTICAL_AXIS
            ) {
                this.deltaY = -e2.detail / 3;
            }

            // horizontal delta scroll
            if (typeof e1.wheelDeltaX !== 'undefined') {
                this.deltaX = e1.wheelDeltaX / 120;
            } else if (
                typeof e2.HORIZONTAL_AXIS !== 'undefined' &&
                e2.axis === e2.HORIZONTAL_AXIS
            ) {
                this.deltaX = -e.detail / 3;
            }
        }
    }

    public preventDefault(): void {
        if (this.event) {
            if (this.event.preventDefault) {
                this.event.preventDefault();
            }
        }
    }

    public stopPropagation(): void {
        if (this.event) {
            if (this.event.stopPropagation) {
                this.event.stopPropagation();
            }
        }
    }
}
