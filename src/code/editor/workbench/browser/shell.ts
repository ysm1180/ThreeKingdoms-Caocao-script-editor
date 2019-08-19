import { ipcRenderer } from 'electron';

import { $, DomBuilder } from '../../../base/browser/domBuilder';
import { ClassDescriptor } from '../../../platform/instantiation/descriptor';
import {
    IInstantiationService, InstantiationService
} from '../../../platform/instantiation/instantiationService';
import { ServiceStorage } from '../../../platform/instantiation/serviceStorage';
import { IStorageService, StorageService } from '../services/electron-browser/storageService';
import { ElectronWindow } from '../window';
import { Workbench } from './workbench';

export class WorkbenchShell {
    private container: HTMLElement;
    private content: HTMLElement;
    private contentContainer: DomBuilder;

    private workbench: Workbench;

    constructor(container: HTMLElement) {
        this.container = container;
    }

    public open() {
        this.content = $(this.container)
            .div({
                class: 'shell-content',
            })
            .getHTMLElement();
        this.contentContainer = this.createContents($(this.content));

        this.layout();

        this.registerListeners();
    }

    public layout() {
        const containerSize = $(this.container).getClientArea();
        if (containerSize !== null) {
            this.contentContainer.size(
                containerSize.width,
                containerSize.height
            );
        } else {
            throw Error('error document body size');
        }

        this.workbench.layout();
    }

    private createContents(parent: DomBuilder): DomBuilder {
        const workbenchContainer = parent.div();

        const serviceStorage = new ServiceStorage();
        const instantiationService = new InstantiationService(serviceStorage);

        serviceStorage.set(
            IStorageService,
            new ClassDescriptor(StorageService, window.localStorage)
        );

        this.workbench = this.createWorkbench(
            instantiationService,
            serviceStorage,
            parent.getHTMLElement(),
            workbenchContainer.getHTMLElement()
        );
        this.workbench.startup();
        ipcRenderer.send('app:workbenchLoaded');

        instantiationService.create(ElectronWindow);

        return workbenchContainer;
    }

    public createWorkbench(
        instantiationService: IInstantiationService,
        serviceStorage: ServiceStorage,
        parent: HTMLElement,
        container: HTMLElement
    ) {
        const workbench = instantiationService.create(
            Workbench,
            container,
            serviceStorage
        );

        return workbench;
    }

    public registerListeners(): void {
        window.addEventListener('resize', () => {
            this.layout();
        });
    }
}
