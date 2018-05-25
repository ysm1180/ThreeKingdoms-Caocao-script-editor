import { ipcRenderer, ipcMain, IpcMessageEvent } from 'electron';
import { decorator } from 'code/platform/instantiation/instantiation';
import { MessageBoxOptions, IMessageBoxResult } from 'code/platform/windows/windows';
import { IWindowMainService, WindowManager } from 'code/electron-main/windows';

export const IWindowClientService = decorator<WindowClientService>('windowClientService');

export class WindowChannel {
    constructor(
        @IWindowMainService private windowMainService: WindowManager,
    ) {
        this.listener();
    }

    public listener() {
        ipcMain.on('showMessageBox', (event: IpcMessageEvent, opts: MessageBoxOptions) => {
            this.windowMainService.showMessageBox(opts).then(result => {
                event.returnValue = result;
            });
        });
    }
}


export class WindowClientService {
    constructor() {

    }

    public showMessageBox(options: MessageBoxOptions): Promise<IMessageBoxResult> {
        return new Promise((c, e) => {
            const result = ipcRenderer.sendSync('showMessageBox', options);
            c(result);
        });
    }
}