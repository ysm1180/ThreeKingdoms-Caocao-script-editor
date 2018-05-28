import { addDisposableEventListener } from 'code/base/browser/dom';
import { StandardKeyboardEvent } from 'code/base/browser/keyboardEvent';
import { KeyCode } from 'code/base/common/keyCodes';
import { decorator } from 'code/platform/instantiation/instantiation';
import { KeybindingsRegistry } from 'code/platform/keybindings/keybindingsRegistry';
import { ICommandService, CommandService } from 'code/platform/commands/commandService';

export const IKeybindingService = decorator<KeybindingService>('keybindingService');

export class KeybindingService {
    constructor(
        windowElement: Window,
        @ICommandService private commandService: CommandService,
    ) {
        addDisposableEventListener(windowElement, 'keydown', (e: KeyboardEvent) => {
            const keyEvent = new StandardKeyboardEvent(e);
            this.dispatch(keyEvent, keyEvent.target);
        });
    }

    private dispatch(event: StandardKeyboardEvent, target: HTMLElement) {
        const items = KeybindingsRegistry.getKeybindings();
        for (let i = 0, len = items.length; i < len; i++) {
            const item = items[i];
            const when = (item.when ? item.when.get() : true);
            const keybinding = item.keybinding;
            if (item.keybinding === event.keyCode && when) {
                this.commandService.run(item.command, item.commandArgs);
            }
        }
    }

    public lookupKeybinding(id: string): KeyCode {
        const items = KeybindingsRegistry.getKeybindings();
        for (const item of items) {
            if (item.command === id) {
                return item.keybinding;
            }
        }

        return null;
    }
}