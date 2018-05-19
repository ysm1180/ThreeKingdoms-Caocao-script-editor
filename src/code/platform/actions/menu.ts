import { MenuId, MenuRegistry, IMenuItem } from 'code/platform/actions/registry';
import { MenuItem } from 'electron';

type MenuItemGroup = [string, IMenuItem[]];

export class MenuItemInfo {
    private _label: string;
    private _command: any;
    private _accelerator: string;

    constructor(menu: IMenuItem) {
        this._label = menu.label;
        this._command = menu.command;
        this._accelerator = menu.shortcutKey;
    }

    public get label(): string {
        return this._label;
    }

    public get command() {
        return this._command;
    }

    public get accelerator() {
        return this._accelerator;
    }
}

export class Separator extends MenuItemInfo {
    constructor() {
        super({
            label: '',
        });
    }
}

export class Menu {
    private menuGroups: MenuItemGroup[] = [];

    constructor(id: MenuId) {
        const menuItems = MenuRegistry.getMenuItems(id);

        menuItems.sort(Menu.comapreMenuItems);

        let group: MenuItemGroup;
        for (let item of menuItems) {
            const groupName = item.group;
            if (!group || group[0] !== groupName) {
                group = [groupName, []];
                this.menuGroups.push(group);
            }

            group[1].push(item);
        }
    }

    public getItems(): MenuItemInfo[] {
        const result: MenuItemInfo[] = [];
        for (let group of this.menuGroups) {
            let [id, items] = group;

            for (const item of items) {
                const menuItemInfo = new MenuItemInfo(item);
                result.push(menuItemInfo);
            }
            result.push(new Separator());
        }

        result.pop();
        return result;
    }

    private static comapreMenuItems(a: IMenuItem, b: IMenuItem): number {
        const groupA = a.group || 'z_end';
        const groupB = b.group || 'z_end';

        if (a.group !== b.group) {
            return a.group.localeCompare(b.group);
        }

        const orderA = a.order || 0;
        const orderB = b.order || 0;

        return a.order - b.order;
    }


}