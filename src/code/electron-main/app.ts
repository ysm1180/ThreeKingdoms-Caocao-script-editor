import { getDefaultState } from './window';
import { AppMenu } from './menus';
import { WindowManager, IWindowService } from './windows';
import { InstantiationService } from '../platform/instantiation/instantiationService';
import { ServiceStorage } from '../platform/instantiation/serviceStorage';
import { WindowChannel } from '../platform/windows/windowsIpc';
import { IFileStorageService, FileStorageService } from '../platform/files/node/fileStorageService';

export class EditorApplication {
    private menu: AppMenu;
    private windowManager: WindowManager;

    constructor() {

    }

    public startup() {
        const serviceStorage = new ServiceStorage();
        const instantiationService = new InstantiationService(serviceStorage);

        serviceStorage.set(IFileStorageService, instantiationService.create(FileStorageService, '.'));

        this.windowManager = instantiationService.create(WindowManager);
        serviceStorage.set(IWindowService, this.windowManager);

        instantiationService.create(WindowChannel);

        this.openFirstWindow();

        this.menu = instantiationService.create(AppMenu);
    }

    public openFirstWindow() {
        const state = getDefaultState();
        this.windowManager.openNewWindow({
            state,
        });
    }
}