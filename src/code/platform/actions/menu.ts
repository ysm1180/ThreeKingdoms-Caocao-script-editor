import { MenuId, MenuRegistry, IMenuItem } from 'code/platform/actions/registry';
import { CommandsRegistry } from 'code/platform/commands/commands';

type MenuItemGroup = [string, IMenuItem[]];

export class MenuItemInfo {
    private _label: string;
    private _command: string;

    constructor(menu: IMenuItem) {
        this._label = menu.label;

        if (menu.command.handler) {
            const command = {
                id: menu.command.id,
                handler: menu.command.handler,
            };
            CommandsRegistry.register(command);
        }

        this._command = menu.command.id;
    }

    public get label(): string {
        return this._label;
    }

    public get command() {
        return this._command;
    }
}

export class Separator extends MenuItemInfo {
    constructor() {
        super({
            label: '',
            command: {
                id: 'seperator',
                handler: () => { }
            },
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

            const oldLength = result.length;
            for (const item of items) {
                const when = item.when ? item.when.get() : true;

                if (when) {
                    const menuItemInfo = new MenuItemInfo(item);
                    result.push(menuItemInfo);
                }
            }

            if (oldLength !== result.length) {
                result.push(new Separator());
            }
        }

        if (result.length) {
            result.pop();
        }
        return result;
    }

    private static comapreMenuItems(a: IMenuItem, b: IMenuItem): number {
        const groupA = a.group || 'z_end';
        const groupB = b.group || 'z_end';

        if (groupA !== groupB) {
            return groupA.localeCompare(groupB);
        }

        const orderA = a.order || 0;
        const orderB = b.order || 0;

        return orderA - orderB;
    }


}