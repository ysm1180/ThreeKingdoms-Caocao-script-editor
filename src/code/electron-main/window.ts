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

export class Window {
    public window: BrowserWindow;

    constructor(
        config: IWindowCreationOption,
    ) {
        this.createBrowserWindow(config);
    }

    private createBrowserWindow(option: IWindowCreationOption) {
        const options: Electron.BrowserWindowConstructorOptions = {
            width: option.state.width,
            height: option.state.height,
        };

        const client = require('electron-connect').client;
        this.window = new BrowserWindow(options);

        this.window.loadURL(url.format({
            pathname: path.join(path.resolve(), 'code/editor/bootstrap/index.html'),
            protocol: 'file:',
            slashes: true
        }));

        client.create(this.window);
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