import { StandardMouseEvent } from '../../base/browser/mouseEvent';

export class ContextMenuEvent {
    public readonly posx: number;
    public readonly posy: number;
    public readonly target: HTMLElement;

    constructor(posx: number, posy: number, target: HTMLElement) {
        this.posx = posx;
        this.posy = posy;
        this.target = target;
    }

    public preventDefault(): void {
        // no-op
    }

    public stopPropagation(): void {
        // no-op
    }
}

export class MouseContextMenuEvent extends ContextMenuEvent {
    private originalEvent: StandardMouseEvent;

    constructor(e: StandardMouseEvent) {
        super(e.posx, e.posy, e.target);
        this.originalEvent = e;
    }

    public preventDefault(): void {
        this.originalEvent.preventDefault();
    }

    public stopPropagation(): void {
        this.originalEvent.stopPropagation();
    }
}