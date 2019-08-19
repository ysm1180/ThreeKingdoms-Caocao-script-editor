import { ICommandHandler } from '../commands/commands';
import { ContextKeyExpr } from '../contexts/contextKey';

export interface IMenuItem {
    command: {
        id: string;
        handler?: ICommandHandler;
        role?: boolean;
    };
    label?: string;
    group?: string;
    order?: number;
    when?: ContextKeyExpr;
}

export class MenuId {
    private static INDEX = 1;

    static readonly Me5ExplorerTreeContext = new MenuId();

    public readonly id = String(MenuId.INDEX++);
}

export const MenuRegistry = new (class {
    _menuItems: { [loc: string]: IMenuItem[] } = Object.create(null);

    public appendMenuItem({ id }: MenuId, item: IMenuItem) {
        let array = this._menuItems[id];
        if (!array) {
            this._menuItems[id] = array = [item];
        } else {
            array.push(item);
        }
    }

    public getMenuItems({ id }: MenuId): IMenuItem[] {
        const result = this._menuItems[id] || [];
        return result;
    }
})();
