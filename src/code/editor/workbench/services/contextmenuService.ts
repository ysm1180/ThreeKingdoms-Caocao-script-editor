import { remote } from 'electron';
import { IContextMenuDelegate } from 'code/base/browser/contextmenu';
import { decorator } from 'code/platform/instantiation/instantiation';
import { MenuItemInfo, Separator } from 'code/platform/actions/menu';


export const IContextMenuService = decorator<ContextMenuService>('contextmenuService');

export class ContextMenuService {
    constructor() {

    }

    public showContextMenu(delegate: IContextMenuDelegate) {
        const items = delegate.getItems();
        const menu = this.createMenu(items);
        const anchor = delegate.getAnchor();

        menu.popup(remote.getCurrentWindow(), {
            x: anchor.x,
            y: anchor.y
        });
    }

    private createMenu(entries: MenuItemInfo[]) {
        const menu = new remote.Menu();

        entries.forEach(entry => {
            if (entry instanceof Separator) {
                menu.append(new remote.MenuItem({type: 'separator'}));
            } else {
                const options: Electron.MenuItemConstructorOptions  = {
                    label: entry.label,
                    click: entry.command,
                    accelerator: entry.accelerator,
                };

                const menuItem = new remote.MenuItem(options);
                menu.append(menuItem);
            }
        });

        return menu;
    }
}