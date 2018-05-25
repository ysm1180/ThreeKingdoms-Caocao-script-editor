import { KeyCode } from 'code/base/common/keyCodes';

export class StandardKeyboardEvent {
    public readonly event: KeyboardEvent;

    public readonly target: HTMLElement;

    public readonly ctrlKey: boolean;
    public readonly shiftKey: boolean;
    public readonly altKey: boolean;
    public readonly keyCode: KeyCode;

    constructor(e: KeyboardEvent) {
        this.event = e;
        this.target = <HTMLElement>e.target;

        this.ctrlKey = e.ctrlKey || this.keyCode === KeyCode.Control;
        this.shiftKey = e.shiftKey || this.keyCode === KeyCode.Alt;
        this.altKey = e.altKey || this.keyCode === KeyCode.Shift;

        this.keyCode = e.keyCode;
    }

    public preventDefault(): void {
        this.event.preventDefault();
    }

    public stopPropagation(): void {
        this.event.stopPropagation();
    }
}