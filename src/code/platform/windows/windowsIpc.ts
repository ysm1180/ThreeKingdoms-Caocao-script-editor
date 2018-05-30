import { ipcRenderer, ipcMain, IpcMessageEvent } from 'electron';
import { MessageBoxOptions, IMessageBoxResult, OpenDialogOptions, IOpenFileRequest } from 'code/platform/windows/windows';
import { WindowManager, IWindowService } from 'code/electron-main/windows';


export class WindowChannel {
    constructor(
        @IWindowService private windowMainService: WindowManager,
    ) {
        this.listener();
    }

    public listener() {
        ipcMain.on('showMessageBox', (event: IpcMessageEvent, opts: MessageBoxOptions) => {
            this.windowMainService.showMessageBox(opts).then(result => {
                event.returnValue = result;
            });
        });

        ipcMain.on('showOpenDialog', (event: IpcMessageEvent, opts: MessageBoxOptions) => {
            this.windowMainService.showOpenDialog(opts).then(result => {
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
}