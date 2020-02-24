import { IpcMainEvent, ipcMain, ipcRenderer } from 'electron';
import {
  IMessageBoxResult,
  IOpenFileRequest,
  ISaveFileRequest,
  IWindowService,
  MessageBoxOptions,
  OpenDialogOptions,
  SaveDialogOptions,
} from 'jojo/platform/windows/common/windows';

export class WindowChannel {
  constructor(private windowMainService: IWindowService) {
    this.registerListeners();
  }

  public registerListeners() {
    ipcMain.on('showMessageBox', (event: IpcMainEvent, opts: MessageBoxOptions) => {
      this.windowMainService.showMessageBox(opts).then((result) => {
        event.returnValue = result;
      });
    });

    ipcMain.on('showOpenDialog', (event: IpcMainEvent, opts: OpenDialogOptions) => {
      this.windowMainService.showOpenDialog(opts).then((result) => {
        event.returnValue = result;
      });
    });

    ipcMain.on('showSaveDialog', (event: IpcMainEvent, opts: SaveDialogOptions) => {
      this.windowMainService.showSaveDialog(opts).then((result) => {
        event.returnValue = result;
      });
    });
  }
}

export class WindowClientService implements IWindowService {
  constructor() {}

  public showOpenDialog(options: OpenDialogOptions): Promise<IOpenFileRequest> {
    return new Promise((c, e) => {
      const result = ipcRenderer.sendSync('showOpenDialog', options);
      c(result);
    });
  }

  public showMessageBox(options: MessageBoxOptions): Promise<IMessageBoxResult> {
    return new Promise((c, e) => {
      const result = ipcRenderer.sendSync('showMessageBox', options);
      c(result);
    });
  }

  public showSaveDialog(options: SaveDialogOptions): Promise<ISaveFileRequest> {
    return new Promise((c, e) => {
      const result = ipcRenderer.sendSync('showSaveDialog', options);
      c(result);
    });
  }
}
