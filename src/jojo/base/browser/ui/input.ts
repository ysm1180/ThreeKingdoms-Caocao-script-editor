import { addDisposableEventListener } from 'jojo/base/browser/dom';
import { Event } from 'jojo/base/common/event';
import { Disposable } from 'jojo/base/common/lifecycle';

export interface InputBoxOption {
  type?: string;
}

export class Input extends Disposable {
  private input: HTMLInputElement;
  private options: InputBoxOption;

  public readonly onDidChange = new Event<string>();

  constructor(container: HTMLElement, options: InputBoxOption = {}) {
    super();

    this.input = <HTMLInputElement>document.createElement('input');
    this.options = options;

    this.input.type = this.options.type || 'text';

    this.registerDispose(
      addDisposableEventListener(this.input, 'click', (e: MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
      })
    );

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
