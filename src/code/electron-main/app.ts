import { getDefaultState } from './window';
import { AppMenu } from './menus';
import { WindowManager } from './windows';
import { ServiceStorage } from '../platform/instantiation/serviceStorage';
import { WindowChannel } from '../platform/windows/windowsIpc';
import { IFileStorageService, FileStorageService } from '../platform/files/node/fileStorageService';
import { ClassDescriptor } from '../platform/instantiation/descriptor';
import { ServicesAccessor } from '../platform/instantiation/instantiation';
import { IWindowMainService } from '../platform/windows/electron-main/windows';
import { IInstantiationService } from '../platform/instantiation/instantiationService';

export class EditorApplication {
    private windowMainService: IWindowMainService;
    private windowChannel: WindowChannel;

    constructor(
        @IInstantiationService private instantiationService: IInstantiationService,
    ) {

    }

    public startup() {
        const appInstantiationService = this.initServices();
        appInstantiationService.invokeFunction(accessor => this.openFirstWindow(accessor));

        appInstantiationService.create(AppMenu);
    }

    private initServices() {
        const serviceStorage = new ServiceStorage();

        serviceStorage.set(IFileStorageService, new ClassDescriptor(FileStorageService, '.'));
        serviceStorage.set(IWindowMainService, new ClassDescriptor(WindowManager));

        return this.instantiationService.createChild(serviceStorage);
    }

    public openFirstWindow(accessor: ServicesAccessor) {
        this.windowMainService = accessor.get(IWindowMainService);
        this.windowChannel = new WindowChannel(this.windowMainService);

        const state = getDefaultState();
        this.windowMainService.openNewWindow({
            state,
        });
    }
}