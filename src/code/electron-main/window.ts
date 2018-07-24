import { BrowserWindow } from 'electron';
import * as path from 'path';
import * as url from 'url';

export interface IWindowState {
    width?: number;
    height?: number;
    x?: number;
    y?: number;
}

export interface IWindowCreationOption {
    state: IWindowState;
}

export const getDefaultState = function (): IWindowState {
    return {
        width: 1024,
        height: 768
    };
};

export class CodeWindow {
    public window: BrowserWindow;

    constructor(
    ) {

    }

    public createBrowserWindow(option: IWindowCreationOption): void {
        const options: Electron.BrowserWindowConstructorOptions = {
            width: option.state.width,
            height: option.state.height,
        };

        this.window = new BrowserWindow(options);

        this.window.loadURL(url.format({
            pathname: path.join(path.resolve(), 'code/editor/bootstrap/index.html'),
            protocol: 'file:',
            slashes: true,
        }));

        if (process.env['NODE_ENV'] === 'development') {
            const client = require('electron-connect').client;
            client.create(this.window);
        }

        this.registerListener();
    }

    private registerListener() {
        this.window.on('closed', () => {
            this.window = null;
        });
    }

    public send(channel: string, ...args: any[]): void {
        this.window.webContents.send(channel, ...args);
    }

}