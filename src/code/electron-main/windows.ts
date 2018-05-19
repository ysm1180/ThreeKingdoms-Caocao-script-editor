import { FileFilter, BrowserWindow, dialog } from 'electron';
import { Window } from 'code/electron-main/window';
import { IOpenFileRequest } from 'code/platform/windows/windows';
import { decorator } from 'code/platform/instantiation/instantiation';

export const IWindowMainService = decorator<WindowManager>('windowManager');

export class WindowManager {
    private dialog: Dialog;
    public static win: Window;

    constructor(currentWindow?: Window) {
        this.dialog = new Dialog();
        WindowManager.win = currentWindow;
    }

    public openNewWindow(options?: Electron.OpenDialogOptions) {
        return this.dialog.showOpenDialog(options, WindowManager.win.window);
    }

    public openWorkingFiles(): Promise<string[]> {
        return this.openNewWindow({
            title: '파일을 선택해주세요',
            filters: this.dialog.getFilters('me5', 'lua'),
            properties: ['multiSelections']
        }).then((paths: string[]) => {
            const data: IOpenFileRequest = {
                files: paths
            };
            WindowManager.win.send('editor:openFiles', data);

            return paths;
        });
    }
}

export class Dialog {
    constructor() {

    }

    public getFilters(...extensions: string[]) : FileFilter[] {
        const filters: FileFilter[] = [];
        
        for (let i = 0; i < extensions.length; i++) {
            const extensionName = `${extensions[i][0].toUpperCase()}${extensions[i].slice(1)}`;
            filters.push({
                name: `${extensionName} 파일 (*.${extensions[i]})`,
                extensions: [extensions[i]],
            });
        }

        return filters;
    }

    public showOpenDialog(options: Electron.OpenDialogOptions, window?: BrowserWindow) {
        return new Promise((c, e) => {
            dialog.showOpenDialog(window ? window : void 0, options, paths => {
                c(paths);
            });
        });
    }
}