'use strict';

import { app } from 'electron';
import { EditorApplication } from './app';

function main() {
    const app = new EditorApplication();
    app.startup();
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
