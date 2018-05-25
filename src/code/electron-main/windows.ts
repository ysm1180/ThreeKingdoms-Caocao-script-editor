import { FileFilter, BrowserWindow, dialog } from 'electron';
import { CodeWindow, IWindowCreationOption } from 'code/electron-main/window';
import { IOpenFileRequest, IMessageBoxResult } from 'code/platform/windows/windows';
import { decorator } from 'code/platform/instantiation/instantiation';
import { IInstantiationService, InstantiationService } from 'code/platform/instantiation/instantiationService';

export const IWindowMainService = decorator<WindowManager>('windowManager');

export class WindowManager {
    private dialog: Dialog;
    public static win: CodeWindow;

    constructor(
        @IInstantiationService private instantiationService: InstantiationService,
    ) {
        this.dialog = new Dialog();
    }

    public openNewWindow(state: IWindowCreationOption) {
        const window = this.instantiationService.create(CodeWindow);
        window.createBrowserWindow(state);

        WindowManager.win = window;
    }

    public showOpenDialog(options?: Electron.OpenDialogOptions) {
        return this.dialog.showOpenDialog(options, WindowManager.win.window);
    }

    public showMessageBox(options?: Electron.MessageBoxOptions) {
        return this.dialog.showMessageBox(options, WindowManager.win.window);
    }

    public openWorkingFiles(): Promise<string[]> {
        return this.showOpenDialog({
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

    public getFilters(...extensions: string[]): FileFilter[] {
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

    public showMessageBox(options: Electron.MessageBoxOptions, window?: BrowserWindow): Promise<IMessageBoxResult> {
        return new Promise((c, e) => {
            dialog.showMessageBox(window ? window : void 0, options, (response: number, checkboxChecked: boolean) => {
                c({ button: response, checkboxChecked });
            });
        });
    }
}