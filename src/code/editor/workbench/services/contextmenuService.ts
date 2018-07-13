import { remote } from 'electron';
import { IContextMenuDelegate } from '../../../base/browser/contextmenu';
import { decorator } from '../../../platform/instantiation/instantiation';
import { MenuItemInfo, Separator } from '../../../platform/actions/menu';
import { ICommandService, CommandService } from '../../../platform/commands/commandService';
import { IKeybindingService, KeybindingService } from '../../../platform/keybindings/keybindingService';
import { IContextKeyService, ContextKeyService } from '../../../platform/contexts/contextKeyService';

export const IContextMenuService = decorator<ContextMenuService>('contextmenuService');

export class ContextMenuService {
    constructor(
        @IContextKeyService private contextKeyService: ContextKeyService,
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
        let isDuplicatedSeparator = true;
        const menuItems = [];
        const menu = new remote.Menu();

        entries.forEach((entry, index) => {
            if (entry instanceof Separator) {
                if (!isDuplicatedSeparator) {
                    menuItems.push(new remote.MenuItem({ type: 'separator' }));
                }
                isDuplicatedSeparator = true;

            } else {
                if (entry.context && !entry.context.evaluate(this.contextKeyService.getContext())) {
                    return;
                }

                let options: Electron.MenuItemConstructorOptions;
                options = {
                    label: entry.label,
                    role: entry.role,
                    click: (item, window, event) => {
                        this.runCommand(entry.command);
                    },
                };

                const keybinding = this.keybindingService.lookupKeybinding(entry.command);
                if (keybinding) {
                    options.accelerator = keybinding.electronShortKey();
                }

                const menuItem = new remote.MenuItem(options);
                menuItems.push(menuItem);

                isDuplicatedSeparator = false;
            }
        });

        if (isDuplicatedSeparator) {
            menuItems.pop();
        }

        menuItems.forEach(menuItem => {
            menu.append(menuItem);
        });

        return menu;
    }

    private runCommand(id: string) {
        this.commandService.run(id);
    }
}