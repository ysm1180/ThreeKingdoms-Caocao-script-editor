export class StandardMouseEvent {
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