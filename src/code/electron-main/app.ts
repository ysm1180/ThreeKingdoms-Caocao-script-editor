import { Window, getDefaultState } from 'code/electron-main/window';
import { AppMenu } from 'code/electron-main/menus';
import { WindowManager } from 'code/electron-main/windows';
import { InstantiationService } from 'code/platform/instantiation/instantiationService';

export class EditorApplication {
    private mainWindow: Window;
    private menu: AppMenu;
    private windowManager: WindowManager;

    constructor() {
        const state = getDefaultState();

        const instant = new InstantiationService();
        this.mainWindow = new Window({
            state
        });
        this.windowManager = new WindowManager(this.mainWindow);
        this.menu = instant.create(AppMenu, this.windowManager);
    }


}