import { DomBuilder, $ } from '../../../base/browser/domBuilder';
import { IInstantiationService } from '../../../platform/instantiation/instantiationService';
import { ServiceStorage } from '../../../platform/instantiation/serviceStorage';
import { ITreeService, TreeService } from '../../../platform/tree/treeService';
import { ICommandService, CommandService } from '../../../platform/commands/commandService';
import { IKeybindingService, KeybindingService } from '../../../platform/keybindings/keybindingService';
import { SidebarPart } from './parts/sidebarPart';
import { WorkbenchLayout } from './layout';
import { EditorPart, IEditorGroupService } from './parts/editor/editorPart';
import { TitlePart, ITitlePartService } from './parts/titlePart';
import { IContextMenuService, ContextMenuService } from '../services/contextmenuService';
import { Me5DataService } from '../services/me5/me5DataService';
import { WindowClientService } from '../../../platform/windows/windowsIpc';
import { IDialogService, DialogService } from '../services/electron-browser/dialogService';
import { StatusbarPart, IStatusbarService } from './parts/statusbarPart';
import { IContextKeyService, ContextKeyService } from '../../../platform/contexts/contextKeyService';
import { ICompositeViewService, CompositeViewService } from '../services/view/compositeViewService';
import { FileService } from '../services/files/node/fileService';
import { Me5FileService } from '../services/me5/me5FileService';
import { IWorkbenchEditorService, WorkbenchEditorService } from '../services/editor/editorService';
import { IPartService } from '../services/part/partService';
import { ITextFileService } from '../services/textfile/textfiles';
import { TextFileService } from '../services/textfile/textFileService';
import { IFileService } from '../services/files/files';
import { ClassDescriptor } from '../../../platform/instantiation/descriptor';
import { IWindowService } from '../../../platform/windows/windows';
import { IResourceFileService } from '../services/resourceFile/resourcefiles';
import { IResourceDataService } from '../services/resourceFile/resourceDataService';

export class Workbench implements IPartService {
    private container: HTMLElement;

    private workbenchContainer: DomBuilder;
    private workbench: DomBuilder;
    private workbenchLayout: WorkbenchLayout;

    private titlePart: TitlePart;
    private sidebarPart: SidebarPart;
    private editorPart: EditorPart;
    private statusbarPart: StatusbarPart;
    private sideBarHidden: boolean;

    private serviceStorage: ServiceStorage;

    constructor(
        container: HTMLElement,
        serviceStorage: ServiceStorage,
        @IInstantiationService private instantiationService: IInstantiationService
    ) {
        this.container = container;
        this.serviceStorage = serviceStorage;

        this.sideBarHidden = true;
    }

    public startup() {
        this.createWorkbench();

        this.initService();

        this.registerListeners();

        this.render();

        this.createLayout();
    }

    private initService() {
        this.serviceStorage.set(IPartService, this);

        this.serviceStorage.set(IContextKeyService, new ClassDescriptor(ContextKeyService));

        this.serviceStorage.set(ITreeService, new ClassDescriptor(TreeService));

        this.serviceStorage.set(IWindowService, new ClassDescriptor(WindowClientService));
        this.serviceStorage.set(IDialogService, new ClassDescriptor(DialogService));

        this.serviceStorage.set(ICommandService, new ClassDescriptor(CommandService));
        this.serviceStorage.set(IKeybindingService, new ClassDescriptor(KeybindingService, window));
        this.serviceStorage.set(IContextMenuService, new ClassDescriptor(ContextMenuService));

        this.serviceStorage.set(IFileService, new ClassDescriptor(FileService));
        this.serviceStorage.set(ITextFileService, new ClassDescriptor(TextFileService));
        this.serviceStorage.set(IResourceFileService, new ClassDescriptor(Me5FileService));
        this.serviceStorage.set(IResourceDataService, new ClassDescriptor(Me5DataService));
        
        this.editorPart = this.instantiationService.create(EditorPart);
        this.serviceStorage.set(IEditorGroupService, this.editorPart);
        this.serviceStorage.set(IWorkbenchEditorService, new ClassDescriptor(WorkbenchEditorService, this.editorPart));
        
        this.sidebarPart = this.instantiationService.create(SidebarPart);

        this.serviceStorage.set(ICompositeViewService, new ClassDescriptor(CompositeViewService, this.sidebarPart));

        this.titlePart = this.instantiationService.create(TitlePart);
        this.serviceStorage.set(ITitlePartService, this.titlePart);

        this.statusbarPart = this.instantiationService.create(StatusbarPart);
        this.serviceStorage.set(IStatusbarService, this.statusbarPart);
    }

    private createWorkbench() {
        this.workbenchContainer = $('.workbench-container');
        this.workbench = $().div({
            class: 'workbench nosidebar'
        }).appendTo(this.workbenchContainer);
    }

    private render() {
        this.createTitle();
        this.createSidebar();
        this.createEditor();
        this.createStatusbar();

        this.workbenchContainer.build(this.container);
    }

    private createTitle(): void {
        const titleContainer = $(this.workbench).div({
            class: 'title'
        });
        this.titlePart.create(titleContainer);
    }

    private createSidebar(): void {
        const sidebarContainer = $(this.workbench).div({
            class: 'sidebar'
        });

        this.sidebarPart.create(sidebarContainer);
    }

    private createEditor(): void {
        const editorContainer = $(this.workbench).div({
            class: 'editor'
        });

        this.editorPart.create(editorContainer);
    }

    private createStatusbar(): void {
        const statusbarContainer = $(this.workbench).div({
            class: 'statusbar'
        });

        this.statusbarPart.create(statusbarContainer);
    }

    private createLayout(): void {
        this.workbenchLayout = this.instantiationService.create(WorkbenchLayout,
            $(this.container),
            this.workbench,
            {
                title: this.titlePart,
                sidebar: this.sidebarPart,
                editor: this.editorPart,
                statusbar: this.statusbarPart,
            });
    }

    public isSidebarVisible(): boolean {
        return !this.sideBarHidden;
    }

    public setSideBarHidden(hidden: boolean): void {
        this.sideBarHidden = hidden;
        if (hidden) {
			this.workbench.addClass('nosidebar');
		} else {
			this.workbench.removeClass('nosidebar');
        }

        if (hidden) {
            
        }
        
        this.layout();
    }

    public layout() {
        this.workbenchLayout.layout();
    }

    public registerListeners() {
        this.editorPart.onEditorInputChanged.add(() => {
            this.statusbarPart.update();
        });
    }

    public dispose() {
        this.sidebarPart.dispose();
    }
}