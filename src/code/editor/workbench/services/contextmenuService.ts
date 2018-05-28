import { remote } from 'electron';
import { IContextMenuDelegate } from 'code/base/browser/contextmenu';
import { decorator } from 'code/platform/instantiation/instantiation';
import { MenuItemInfo, Separator } from 'code/platform/actions/menu';
import { ICommandService, CommandService } from 'code/platform/commands/commandService';
import { IKeybindingService, KeybindingService } from 'code/platform/keybindings/keybindingService';
import { KeyCodeUtils } from '../../../base/common/keyCodes';


export const IContextMenuService = decorator<ContextMenuService>('contextmenuService');

export class ContextMenuService {
    constructor(
        @ICommandService private commandService: CommandService,
        @IKeybindingService private keybindingService: KeybindingService,
    ) {
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
                    click: (item, window, event) => {
                        this.runCommand(entry.command);
                    },
                };

                const keybinding = this.keybindingService.lookupKeybinding(entry.command);
                if (keybinding) {
                    options.accelerator = KeyCodeUtils.toString(keybinding);
                }

                const menuItem = new remote.MenuItem(options);
                menu.append(menuItem);
            }
        });

        return menu;
    }

    private runCommand(id: string) {
        this.commandService.run(id);
    }
}