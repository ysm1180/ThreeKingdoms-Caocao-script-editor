import { KeyCode } from 'code/base/common/keyCodes';
import { ICommandHandler, CommandsRegistry } from 'code/platform/commands/commands';

export interface IKeybindingRule {
    id: string;
    primary: KeyCode;
    handler: ICommandHandler;
}

export interface IKeybindingItem {
    command: string;
    commandArgs?: any;
    keybinding: KeyCode;
}

export const KeybindingsRegistry = new class {
    private _keybindings: IKeybindingItem[];

    constructor() {
        this._keybindings = [];
    }

    public registerKeybindingRule(rule: IKeybindingRule) {
        if (rule && rule.primary) {
            this._keybindings.push({
                command: rule.id,
                commandArgs: null,
                keybinding: rule.primary,
            });

            CommandsRegistry.register(rule);
        }
    }

    public getKeybindings(): IKeybindingItem[] {
        return this._keybindings.slice(0);
    }
};