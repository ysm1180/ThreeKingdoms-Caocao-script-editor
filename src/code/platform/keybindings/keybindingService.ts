import { addDisposableEventListener } from 'code/base/browser/dom';
import { StandardKeyboardEvent } from 'code/base/browser/keyboardEvent';
import { decorator } from 'code/platform/instantiation/instantiation';
import { KeybindingsRegistry } from './keybindingsRegistry';
import { ICommandService, CommandService } from '../commands/commandService';

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
            const keybinding = item.keybinding;
            if (item.keybinding === event.keyCode) {
                this.commandService.run(item.command, item.commandArgs);
            }
        }
    }
}