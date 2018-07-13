import { ipcRenderer, ipcMain, IpcMessageEvent  } from 'electron';
import { MessageBoxOptions, IMessageBoxResult, OpenDialogOptions, IOpenFileRequest, ISaveFileRequest, SaveDialogOptions } from './windows';
import { WindowManager, IWindowService } from '../../electron-main/windows';


export class WindowChannel {
    constructor(
        @IWindowService private windowMainService: WindowManager,
    ) {
        this.registerListeners();
    }

    public registerListeners() {
        ipcMain.on('showMessageBox', (event: IpcMessageEvent, opts: MessageBoxOptions) => {
            this.windowMainService.showMessageBox(opts).then(result => {
                event.returnValue = result;
            });
        });

        ipcMain.on('showOpenDialog', (event: IpcMessageEvent, opts: OpenDialogOptions) => {
            this.windowMainService.showOpenDialog(opts).then(result => {
                event.returnValue = result;
            });
        });

        ipcMain.on('showSaveDialog', (event: IpcMessageEvent, opts: SaveDialogOptions) => {
            this.windowMainService.showSaveDialog(opts).then(result => {
                event.returnValue = result;
            });
        });

    }
}


export class WindowClientService implements IWindowService {
    constructor(private channel: WindowChannel) {
        
    }

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