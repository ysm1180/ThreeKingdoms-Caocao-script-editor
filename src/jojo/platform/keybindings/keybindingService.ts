import { addDisposableEventListener } from 'jojo/base/browser/dom';
import { StandardKeyboardEvent } from 'jojo/base/browser/keyboardEvent';
import { KeyMode, Keybinding } from 'jojo/base/common/keyCodes';
import { ICommandService } from 'jojo/platform/commands/common/commands';
import { IContextKeyService } from 'jojo/platform/contexts/common/contextKey';
import { decorator } from 'jojo/platform/instantiation/common/instantiation';
import { KeybindingsRegistry } from 'jojo/platform/keybindings/keybindingsRegistry';

export const IKeybindingService = decorator<KeybindingService>('keybindingService');

export class KeybindingService {
  constructor(
    windowElement: Window,
    @IContextKeyService private contextKeyService: IContextKeyService,
    @ICommandService private commandService: ICommandService
  ) {
    addDisposableEventListener(windowElement, 'keydown', (e: KeyboardEvent) => {
      const keyEvent = new StandardKeyboardEvent(e);
      this.dispatch(keyEvent, keyEvent.target);
    });
  }

  private dispatch(event: StandardKeyboardEvent, target: HTMLElement) {
    const items = KeybindingsRegistry.getKeybindings();
    const keyboard = this.resolveKeyboardEvent(event);

    for (let i = 0, len = items.length; i < len; i++) {
      const item = items[i];
      const when = item.when ? item.when.evaluate(this.contextKeyService.getContext()) : true;
      const keybinding = this.resolveKeybinding(item.keybinding);
      if (keybinding.equals(keyboard) && when) {
        this.commandService.run(item.command, item.commandArgs);
      }
    }
  }

  private resolveKeyboardEvent(e: StandardKeyboardEvent) {
    const ctrlKey = e.ctrlKey;
    const shiftKey = e.shiftKey;
    const altKey = e.altKey;
    const keyCode = e.keyCode;

    return new Keybinding(ctrlKey, shiftKey, altKey, keyCode);
  }

  public resolveKeybinding(keybinding: number) {
    const ctrlKey = keybinding & KeyMode.Ctrl ? true : false;
    const shiftKey = keybinding & KeyMode.Shift ? true : false;
    const altKey = keybinding & KeyMode.Alt ? true : false;
    const keyCode = keybinding & 0xff;

    return new Keybinding(ctrlKey, shiftKey, altKey, keyCode);
  }

  public lookupKeybinding(id: string): Keybinding {
    const items = KeybindingsRegistry.getKeybindings();
    for (const item of items) {
      if (item.command === id) {
        return this.resolveKeybinding(item.keybinding);
      }
    }

    return null;
  }
}
