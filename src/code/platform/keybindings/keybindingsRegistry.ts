import { KeyCode } from '../../base/common/keyCodes';
import { CommandsRegistry, ICommandHandler } from '../commands/commands';
import { ContextKeyExpr } from '../contexts/contextKey';

export interface IKeybindingRule {
    id: string;
    primary: KeyCode;
    handler: ICommandHandler;
    when?: ContextKeyExpr;
}

export interface IKeybindingItem {
    command: string;
    commandArgs?: any;
    keybinding: KeyCode;
    when: ContextKeyExpr;
}

export const KeybindingsRegistry = new (class {
    _keybindings: IKeybindingItem[];

    constructor() {
        this._keybindings = [];
    }

    public registerKeybindingRule(rule: IKeybindingRule) {
        if (rule && rule.primary) {
            this._keybindings.push({
                command: rule.id,
                commandArgs: null,
                keybinding: rule.primary,
                when: rule.when,
            });

            CommandsRegistry.register(rule);
        }
    }

    public getKeybindings(): IKeybindingItem[] {
        return this._keybindings.slice(0);
    }
})();
