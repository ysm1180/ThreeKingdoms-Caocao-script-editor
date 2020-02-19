'use strict';

import { app } from 'electron';

import { IInstantiationService } from '../../platform/instantiation/instantiation';
import { InstantiationService } from '../../platform/instantiation/instantiationService';
import { ServiceStorage } from '../../platform/instantiation/serviceStorage';
import { EditorApplication } from './app';

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
