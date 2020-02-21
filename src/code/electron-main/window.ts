import * as path from 'path';
import * as url from 'url';

import { BrowserWindow } from 'electron';

export interface IWindowState {
  width?: number;
  height?: number;
  x?: number;
  y?: number;
}

export interface IWindowCreationOption {
  state: IWindowState;
}

export const getDefaultState = function(): IWindowState {
  return {
    width: 1024,
    height: 768,
  };
};

export class CodeWindow {
  public window: BrowserWindow;

  constructor(option: IWindowCreationOption) {
    this.createBrowserWindow(option);
  }

  public createBrowserWindow(option: IWindowCreationOption): void {
    const options: Electron.BrowserWindowConstructorOptions = {
      width: option.state.width,
      height: option.state.height,
      webPreferences: {
        nodeIntegration: true,
      },
    };

    this.window = new BrowserWindow(options);

    this.window.loadURL(
      url.format({
        pathname: path.join(__dirname, '../workbench/workbench.html'),
        protocol: 'file:',
        slashes: true,
      })
    );

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
