import { $, DomBuilder } from 'code/base/browser/domBuilder';
import { Workbench } from 'code/editor/workbench/browser/workbench';
import { ElectronWindow } from 'code/editor/workbench/window';
import { InstantiationService } from 'code/platform/instantiation/instantiationService';
import { ServiceStorage } from 'code/platform/instantiation/serviceStorage';
import { IWindowService, WindowManager } from 'code/electron-main/windows';
import { IStorageService, StorageService } from 'code/editor/workbench/services/electron-browser/storageService';

export class WorkbenchShell {
    private container: HTMLElement;
    private content: HTMLElement;
    private contentContainer: DomBuilder;

    private workbench: Workbench;

    constructor(
        container: HTMLElement
    ) {
        this.container = container;
    }

    public open() {
        this.content = $(this.container).div({
            class: 'shell-content'
        }).getHTMLElement();
        this.contentContainer = this.createContents($(this.content));

        this.layout();

        this.registerListeners();
    }

    public layout() {
        const containerSize = $(this.container).getClientArea();
        if (containerSize !== null) {
            this.contentContainer.size(containerSize.width, containerSize.height);
        } else {
            throw Error('error document body size');
        }

        this.workbench.layout();
    }

    private createContents(parent: DomBuilder): DomBuilder {
        const workbenchContainer = parent.div();

        const serviceStorage = new ServiceStorage();
        const instantiationService = new InstantiationService(serviceStorage);

        serviceStorage.set(IStorageService, instantiationService.create(StorageService, window.localStorage));
        serviceStorage.set(IWindowService, instantiationService.create(WindowManager));

        this.workbench = this.createWorkbench(instantiationService, serviceStorage, parent.getHTMLElement(), workbenchContainer.getHTMLElement());
        this.workbench.startup();

        instantiationService.create(ElectronWindow);

        return workbenchContainer;
    }

    public createWorkbench(instantiationService: InstantiationService, serviceStorage: ServiceStorage, parent: HTMLElement, container: HTMLElement) {
        const workbench = instantiationService.create(Workbench, container, serviceStorage);

        return workbench;
    }

    public registerListeners(): void {
        window.addEventListener('resize', () => {
            this.layout();
        });
    }
}