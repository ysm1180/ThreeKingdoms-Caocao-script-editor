'use strict';

import { app, BrowserWindow } from 'electron';
import { EditorApplication } from 'code/electron-main/app';

function main() {
    const app = new EditorApplication();
}

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate',(event: Event, hasVisibleWindows: boolean) => {
    if (!hasVisibleWindows) {
    }
});

main();
