import * as path from 'path';
import { BrowserWindow, dialog, app } from 'electron';
import { CodeWindow, IWindowCreationOption } from './window';
import { getFileFilters, IFileExtension } from '../platform/dialogs/dialogs';
import { decorator, ServiceIdentifier } from '../platform/instantiation/instantiation';
import { IOpenFileRequest, IMessageBoxResult, ISaveFileRequest } from '../platform/windows/windows';
import { IInstantiationService } from '../platform/instantiation/instantiationService';
import { IFileStorageService, FileStorageService } from '../platform/files/node/fileStorageService';

export const IWindowService: ServiceIdentifier<IWindowService> = decorator<IWindowService>('windowService');

export interface IWindowService {
    showOpenDialog(options: Electron.OpenDialogOptions): Promise<IOpenFileRequest>;

    showMessageBox(options: Electron.MessageBoxOptions): Promise<IMessageBoxResult>;

    showSaveDialog(options: Electron.SaveDialogOptions): Promise<ISaveFileRequest>;
}

export class WindowManager implements IWindowService {
    public static workingPathKey = 'workingPath';

    private dialog: Dialog;
    public static win: CodeWindow;

    constructor(
        @IFileStorageService private fileStorageService: FileStorageService,
        @IInstantiationService private instantiationService: IInstantiationService,
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

    public showSaveDialog(options?: Electron.SaveDialogOptions) {
        return this.dialog.showSaveDialog(options, WindowManager.win.window);
    }

    public openNewFile() {
        const request: IOpenFileRequest = {
            files: [null],
        };

        WindowManager.win.send('editor:openFiles', request);
    }

    public openWorkingFiles(): Promise<IOpenFileRequest> {
        const recentWorkingPath: string = this.fileStorageService.get(WindowManager.workingPathKey);
    
        const filters: IFileExtension[] = [
            {
                name: '작업 파일',
                extensions: 'me5;lua',
            },
            {
                extensions: 'me5',
            },
            {
                extensions: 'lua',
            },
        ];

        return this.showOpenDialog({
            title: '파일을 선택해주세요',
            filters: getFileFilters(...filters),
            properties: ['multiSelections'],
            defaultPath: recentWorkingPath,
        }).then((data: IOpenFileRequest) => {
            if (data.files && data.files.length > 0) {
                const dir = path.dirname(data.files[0]);
                this.fileStorageService.store(WindowManager.workingPathKey, dir);
            }

            WindowManager.win.send('editor:openFiles', data);

            return data;
        });
    }

    public saveFile() {
        WindowManager.win.send('editor:saveFile');
    }

    public quit() {
        app.quit();
    }
}

export class Dialog {
    constructor(

    ) {

    }

    public showOpenDialog(options: Electron.OpenDialogOptions, window?: BrowserWindow): Promise<IOpenFileRequest> {
        return new Promise((c, e) => {
            dialog.showOpenDialog(window ? window : void 0, options, paths => {
                c({ files: paths });
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

    public showSaveDialog(options: Electron.SaveDialogOptions, window?: BrowserWindow): Promise<ISaveFileRequest> {
        return new Promise((c, e) => {
            dialog.showSaveDialog(window ? window : void 0, options, path => {
                c({ file: path });
            });
        });
    }
}