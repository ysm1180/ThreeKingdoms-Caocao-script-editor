import { remote } from 'electron';
import { IContextMenuDelegate } from 'jojo/base/browser/contextmenu';
import { MenuItemInfo, Separator } from 'jojo/platform/actions/common/menu';
import { ICommandService } from 'jojo/platform/commands/common/commands';
import { IContextKeyService } from 'jojo/platform/contexts/common/contextKey';
import { decorator } from 'jojo/platform/instantiation/common/instantiation';
import { IKeybindingService, KeybindingService } from 'jojo/platform/keybindings/keybindingService';

export const IContextMenuService = decorator<ContextMenuService>('contextmenuService');

export class ContextMenuService {
  constructor(
    @IContextKeyService private contextKeyService: IContextKeyService,
    @ICommandService private commandService: ICommandService,
    @IKeybindingService private keybindingService: KeybindingService
  ) {}

  public showContextMenu(delegate: IContextMenuDelegate) {
    const items = delegate.getItems();
    const menu = this.createMenu(items);
    const anchor = delegate.getAnchor();

    menu.popup({
      window: remote.getCurrentWindow(),
      x: anchor.x,
      y: anchor.y,
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
          role: entry.role as
            | 'undo'
            | 'redo'
            | 'cut'
            | 'copy'
            | 'paste'
            | 'pasteAndMatchStyle'
            | 'delete'
            | 'selectAll'
            | 'reload'
            | 'forceReload'
            | 'toggleDevTools'
            | 'resetZoom'
            | 'zoomIn'
            | 'zoomOut'
            | 'togglefullscreen'
            | 'window'
            | 'minimize'
            | 'close'
            | 'help'
            | 'about'
            | 'services'
            | 'hide'
            | 'hideOthers'
            | 'unhide'
            | 'quit'
            | 'startSpeaking'
            | 'stopSpeaking'
            | 'close'
            | 'minimize'
            | 'zoom'
            | 'front'
            | 'appMenu'
            | 'fileMenu'
            | 'editMenu'
            | 'viewMenu'
            | 'recentDocuments'
            | 'toggleTabBar'
            | 'selectNextTab'
            | 'selectPreviousTab'
            | 'mergeAllWindows'
            | 'clearRecentDocuments'
            | 'moveTabToNewWindow'
            | 'windowMenu',
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

    menuItems.forEach((menuItem) => {
      menu.append(menuItem);
    });

    return menu;
  }

  private runCommand(id: string) {
    this.commandService.run(id);
  }
}
