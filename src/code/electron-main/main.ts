'use strict';

import { app } from 'electron';
import { EditorApplication } from './app';
import { IInstantiationService, InstantiationService } from '../platform/instantiation/instantiationService';
import { ServiceStorage } from '../platform/instantiation/serviceStorage';

function createService(): IInstantiationService {
    const services = new ServiceStorage();

    return new InstantiationService(services);
}

function main() {
    const instantiationService = createService();
    const app = instantiationService.create(EditorApplication);
    app.startup();
}

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', (event: Event, hasVisibleWindows: boolean) => {
    if (!hasVisibleWindows) {
    }
});

main();
