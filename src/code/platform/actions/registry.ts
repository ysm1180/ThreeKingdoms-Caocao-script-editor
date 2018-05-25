import { ServicesAccessor } from 'code/platform/instantiation/instantiation';

export interface IMenuItem {
    command?: (accessor: ServicesAccessor) => void;
    label: string;
    visible?: boolean;
    shortcutKey?: string;
    group?: string;
    order?: number;
}

export class MenuId {
    private static INDEX = 1;

    static readonly Me5ExplorerContext = new MenuId();

    public readonly id = String(MenuId.INDEX++);
}

export const MenuRegistry = new class {
    private _menuItems: { [loc: string]: IMenuItem[] } = Object.create(null);

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
};