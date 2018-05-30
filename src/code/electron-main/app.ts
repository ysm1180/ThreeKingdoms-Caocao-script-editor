import { CodeWindow, getDefaultState } from 'code/electron-main/window';
import { AppMenu } from 'code/electron-main/menus';
import { WindowManager, IWindowService } from 'code/electron-main/windows';
import { InstantiationService } from 'code/platform/instantiation/instantiationService';
import { ServiceStorage } from 'code/platform/instantiation/serviceStorage';
import { WindowChannel } from 'code/platform/windows/windowsIpc';
import { IFileStorageService, FileStorageService } from 'code/platform/files/node/fileStorageService';

export class EditorApplication {
    private mainWindow: CodeWindow;
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