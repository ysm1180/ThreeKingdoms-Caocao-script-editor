import { AppMenu } from 'jojo/code/electron-main/menus';
import { getDefaultState } from 'jojo/code/electron-main/window';
import { WindowManager } from 'jojo/code/electron-main/windows';
import { FileStorageService, IFileStorageService } from 'jojo/platform/files/node/fileStorageService';
import { ClassDescriptor } from 'jojo/platform/instantiation/common/descriptors';
import { IInstantiationService, ServicesAccessor } from 'jojo/platform/instantiation/common/instantiation';
import { ServiceStorage } from 'jojo/platform/instantiation/common/serviceStorage';
import { IWindowMainService } from 'jojo/platform/windows/electron-main/windows';
import { WindowChannel } from 'jojo/platform/windows/node/windowsIpc';

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
