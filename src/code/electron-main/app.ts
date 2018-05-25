import { CodeWindow, getDefaultState } from 'code/electron-main/window';
import { AppMenu } from 'code/electron-main/menus';
import { WindowManager, IWindowMainService } from 'code/electron-main/windows';
import { InstantiationService } from 'code/platform/instantiation/instantiationService';
import { ServiceStorage } from '../platform/instantiation/serviceStorage';
import { WindowChannel } from '../platform/windows/windowsIpc';

export class EditorApplication {
    private mainWindow: CodeWindow;
    private menu: AppMenu;
    private windowManager: WindowManager;

    constructor() {

    }

    public startup() {
        const serviceStorage = new ServiceStorage();
        const instantiationService = new InstantiationService(serviceStorage);

        this.windowManager = instantiationService.create(WindowManager);
        serviceStorage.set(IWindowMainService, this.windowManager);
        
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