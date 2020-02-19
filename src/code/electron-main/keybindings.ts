import { ipcMain } from 'electron';

import { Event } from '../../base/common/event';
import { IWindowMainService } from '../../platform/windows/electron-main/windows';
import { CodeWindow } from './window';

export interface IKeybinding {
  id: string;
  label: string;
}

export class KeybindingsResolver {
  private commandIds: Set<string>;
  private keybindings: { [commandId: string]: IKeybinding };

  public onKeybindingsChanged = new Event<void>();

  constructor(@IWindowMainService private windowMainService: IWindowMainService) {
    this.commandIds = new Set<string>();
    this.keybindings = Object.create(null);

    this._registerListeners();
  }

  private _registerListeners(): void {
    ipcMain.on('app:keybindingsResolved', (e, rawKeybindings: string) => {
      let keybindings: IKeybinding[] = [];
      try {
        keybindings = JSON.parse(rawKeybindings);
      } catch (error) {
        // Should not happen
      }

      const resolvedKeybindings: {
        [commandId: string]: IKeybinding;
      } = Object.create(null);
      let keybindingsChanged = false;
      let keybindingsCount = 0;
      keybindings.forEach((keybinding) => {
        keybindingsCount++;

        resolvedKeybindings[keybinding.id] = keybinding;

        if (!this.keybindings[keybinding.id] || keybinding.label !== this.keybindings[keybinding.id].label) {
          keybindingsChanged = true;
        }
      });

      if (Object.keys(this.keybindings).length !== keybindingsCount) {
        keybindingsChanged = true;
      }

      if (keybindingsChanged) {
        this.keybindings = resolvedKeybindings;

        this.onKeybindingsChanged.fire();
      }
    });

    const once = this.windowMainService.onWindowReady.add((win) => {
      once.dispose();
      this.resolveKeybindings(win);
    });
  }

  private resolveKeybindings(win: CodeWindow): void {
    if (this.commandIds.size && win) {
      const commandIds: string[] = [];
      this.commandIds.forEach((id) => commandIds.push(id));
      win.send('app:resolveKeybindings', JSON.stringify(commandIds));
    }
  }

  public getKeybinding(commandId: string): IKeybinding {
    if (!commandId) {
      return void 0;
    }

    if (!this.commandIds.has(commandId)) {
      this.commandIds.add(commandId);
    }

    return this.keybindings[commandId];
  }
}
