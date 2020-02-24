'use strict';

import { app } from 'electron';
import { EditorApplication } from 'jojo/code/electron-main/app';
import { IInstantiationService } from 'jojo/platform/instantiation/common/instantiation';
import { InstantiationService } from 'jojo/platform/instantiation/common/instantiationService';
import { ServiceStorage } from 'jojo/platform/instantiation/common/serviceStorage';

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
