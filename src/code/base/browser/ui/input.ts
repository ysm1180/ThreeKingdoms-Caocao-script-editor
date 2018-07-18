import { Event } from '../../common/event';
import { Disposable } from '../../common/lifecycle';
import { addDisposableEventListener } from '../dom';

export interface InputBoxOption {
    type?: string;
}

export class Input extends Disposable {
    private input: HTMLInputElement;
    private options: InputBoxOption;

    public onDidChange = new Event<string>();

    constructor(container: HTMLElement, options: InputBoxOption = {}) {
        super();

        this.input = <HTMLInputElement>document.createElement('input');
        this.options = options;

        this.input.type = this.options.type || 'text';

        this.registerDispose(addDisposableEventListener(this.input, 'click', (e: MouseEvent) => {
            e.preventDefault();
            e.stopPropagation();
        }));

        container.appendChild(this.input);
    }

    public get inputElement(): HTMLInputElement {
        return this.input;
    }

    public focus(): void {
        this.input.focus();
    }

    public set value(value: string) {
        this.input.value = value;
    }

    public get value(): string {
        return this.input.value;
    }

    public dispose(): void {
        super.dispose();
    }
}