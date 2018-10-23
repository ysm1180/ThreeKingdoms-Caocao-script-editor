import { DomBuilder, $ } from '../../../base/browser/domBuilder';
import { IInstantiationService } from '../../../platform/instantiation/instantiationService';
import { ServiceStorage } from '../../../platform/instantiation/serviceStorage';
import { ITreeService, TreeService } from '../../../platform/tree/treeService';
import { ICommandService, CommandService } from '../../../platform/commands/commandService';
import { IKeybindingService, KeybindingService } from '../../../platform/keybindings/keybindingService';
import { SidebarPart } from './parts/sidebarPart';
import { WorkbenchLayout } from './layout';
import { EditorPart, IEditorService } from './parts/editor/editorPart';
import { TitlePart, ITitlePartService } from './parts/titlePart';
import { IContextMenuService, ContextMenuService } from '../services/contextmenuService';
import { IMe5DataService, Me5DataService } from '../services/me5/me5DataService';
import { WindowClientService } from '../../../platform/windows/windowsIpc';
import { IDialogService, DialogService } from '../services/electron-browser/dialogService';
import { StatusbarPart, IStatusbarService } from './parts/statusbarPart';
import { IContextKeyService, ContextKeyService } from '../../../platform/contexts/contextKeyService';
import { ICompositeViewService, CompositeViewService } from '../services/view/compositeViewService';
import { FileService } from '../services/files/node/fileService';
import { IMe5FileService, Me5FileService } from '../services/me5/me5FileService';
import { IWorkbenchEditorService, WorkbenchEditorService } from '../services/editor/editorService';
import { IPartService } from '../services/part/partService';
import { ITextFileService } from '../services/textfile/textfiles';
import { TextFileService } from '../services/textfile/textFileService';
import { IFileService } from '../services/files/files';
import { ClassDescriptor } from '../../../platform/instantiation/descriptor';
import { IWindowService } from '../../../platform/windows/windows';

export class Workbench implements IPartService {
    private container: HTMLElement;

    private workbenchContainer: DomBuilder;
    private workbench: DomBuilder;
    private workbenchLayout: WorkbenchLayout;

    private title: TitlePart;
    private sidebar: SidebarPart;
    private editor: EditorPart;
    private statusbar: StatusbarPart;
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

        this.serviceStorage.set(IMe5DataService, new ClassDescriptor(Me5DataService));
        this.serviceStorage.set(IMe5FileService, new ClassDescriptor(Me5FileService));

        this.serviceStorage.set(IFileService, new ClassDescriptor(FileService));
        this.serviceStorage.set(ITextFileService, new ClassDescriptor(TextFileService));

        this.editor = this.instantiationService.create(EditorPart);
        this.serviceStorage.set(IEditorService, this.editor);
        this.serviceStorage.set(IWorkbenchEditorService, new ClassDescriptor(WorkbenchEditorService, this.editor));
        
        this.sidebar = this.instantiationService.create(SidebarPart);

        this.serviceStorage.set(ICompositeViewService, new ClassDescriptor(CompositeViewService, this.sidebar));

        this.title = this.instantiationService.create(TitlePart);
        this.serviceStorage.set(ITitlePartService, this.title);

        this.statusbar = this.instantiationService.create(StatusbarPart);
        this.serviceStorage.set(IStatusbarService, this.statusbar);
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
        this.title.create(titleContainer);
    }

    private createSidebar(): void {
        const sidebarContainer = $(this.workbench).div({
            class: 'sidebar'
        });

        this.sidebar.create(sidebarContainer);
    }

    private createEditor(): void {
        const editorContainer = $(this.workbench).div({
            class: 'editor'
        });

        this.editor.create(editorContainer);
    }

    private createStatusbar(): void {
        const statusbarContainer = $(this.workbench).div({
            class: 'statusbar'
        });

        this.statusbar.create(statusbarContainer);
    }

    private createLayout(): void {
        this.workbenchLayout = this.instantiationService.create(WorkbenchLayout,
            $(this.container),
            this.workbench,
            {
                title: this.title,
                sidebar: this.sidebar,
                editor: this.editor,
                statusbar: this.statusbar,
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
        this.editor.onEditorInputChanged.add(() => {
            this.statusbar.update();
        });
    }

    public dispose() {
        this.sidebar.dispose();
    }
}