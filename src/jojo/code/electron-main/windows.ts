import * as path from 'path';

import { BrowserWindow, app, dialog, ipcMain } from 'electron';
import { Event } from 'jojo/base/common/event';
import { CodeWindow, IWindowCreationOption } from 'jojo/code/electron-main/window';
import { IFileExtension, getFileFilters } from 'jojo/platform/dialogs/common/dialogs';
import { FileStorageService, IFileStorageService } from 'jojo/platform/files/node/fileStorageService';
import { IInstantiationService } from 'jojo/platform/instantiation/common/instantiation';
import { IMessageBoxResult, IOpenFileRequest, ISaveFileRequest } from 'jojo/platform/windows/common/windows';
import { IWindowMainService } from 'jojo/platform/windows/electron-main/windows';

export class WindowManager implements IWindowMainService {
  private dialog: Dialog;

  public onWindowReady = new Event<CodeWindow>();

  public static workingPathKey = 'workingPath';
  public static win: CodeWindow;

  constructor(
    @IFileStorageService private fileStorageService: FileStorageService,
    @IInstantiationService private instantiationService: IInstantiationService
  ) {
    this.dialog = new Dialog();

    this._registerListeners();
  }

  private _registerListeners(): void {
    ipcMain.on('app:workbenchLoaded', (_event: any) => {
      this.onWindowReady.fire(WindowManager.win);
    });
  }

  public openNewWindow(option: IWindowCreationOption) {
    WindowManager.win = this.instantiationService.create(CodeWindow, option);
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

  public openMe5NewFile() {
    const request: IOpenFileRequest = {
      files: ['untitled.me5'],
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
  constructor() {}

  public showOpenDialog(options: Electron.OpenDialogOptions, window?: BrowserWindow): Promise<IOpenFileRequest> {
    return new Promise((c, e) => {
      dialog.showOpenDialog(window ? window : void 0, options).then(({ filePaths }) => {
        c({ files: filePaths });
      });
    });
  }

  public showMessageBox(options: Electron.MessageBoxOptions, window?: BrowserWindow): Promise<IMessageBoxResult> {
    return new Promise((c, e) => {
      dialog.showMessageBox(window ? window : void 0, options).then(({ response, checkboxChecked }) => {
        c({ button: response, checkboxChecked });
      });
    });
  }

  public showSaveDialog(options: Electron.SaveDialogOptions, window?: BrowserWindow): Promise<ISaveFileRequest> {
    return new Promise((c, e) => {
      dialog.showSaveDialog(window ? window : void 0, options).then(({ filePath }) => {
        c({ file: filePath });
      });
    });
  }
}
