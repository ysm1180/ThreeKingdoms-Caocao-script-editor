import { FileStorageService, IFileStorageService } from '../../platform/files/node/fileStorageService';
import { ClassDescriptor } from '../../platform/instantiation/descriptors';
import { ServicesAccessor } from '../../platform/instantiation/instantiation';
import { IInstantiationService } from '../../platform/instantiation/instantiation';
import { ServiceStorage } from '../../platform/instantiation/serviceStorage';
import { IWindowMainService } from '../../platform/windows/electron-main/windows';
import { WindowChannel } from '../../platform/windows/windowsIpc';
import { AppMenu } from './menus';
import { getDefaultState } from './window';
import { WindowManager } from './windows';

export class EditorApplication {
  private windowMainService: IWindowMainService;
  private windowChannel: WindowChannel;

  constructor(@IInstantiationService private instantiationService: IInstantiationService) {}

  public startup() {
    const appInstantiationService = this.initServices();
    appInstantiationService.invokeFunction((accessor) => this.openFirstWindow(accessor));

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
