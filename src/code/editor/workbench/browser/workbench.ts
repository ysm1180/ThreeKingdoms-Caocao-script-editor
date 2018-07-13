import { DomBuilder, $ } from '../../../base/browser/domBuilder';
import { IInstantiationService, InstantiationService } from '../../../platform/instantiation/instantiationService';
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
import { IWindowService } from '../../../electron-main/windows';
import { StatusbarPart, IStatusbarService } from './parts/statusbarPart';
import { IContextKeyService, ContextKeyService } from '../../../platform/contexts/contextKeyService';
import { ICompositeViewService, CompositeViewService } from '../services/view/compositeViewService';

export class Workbench {
    private container: HTMLElement;

    private workbenchContainer: DomBuilder;
    private workbench: DomBuilder;
    private workbenchLayout: WorkbenchLayout;

    private title: TitlePart;
    private sidebar: SidebarPart;
    private editor: EditorPart;
    private statusbar: StatusbarPart;

    private serviceStorage: ServiceStorage;

    constructor(
        container: HTMLElement,
        serviceStorage: ServiceStorage,
        @IInstantiationService private instantiationService: InstantiationService
    ) {
        this.container = container;
        this.serviceStorage = serviceStorage;
    }

    public startup() {
        this.createWorkbench();

        this.initService();

        this.registerListeners();

        this.render();

        this.createLayout();
    }

    private initService() {
        this.serviceStorage.set(IContextKeyService, this.instantiationService.create(ContextKeyService));

        this.serviceStorage.set(ITreeService, this.instantiationService.create(TreeService));

        this.serviceStorage.set(IWindowService, this.instantiationService.create(WindowClientService));
        this.serviceStorage.set(IDialogService, this.instantiationService.create(DialogService));

        this.serviceStorage.set(ICommandService, this.instantiationService.create(CommandService));
        this.serviceStorage.set(IKeybindingService, this.instantiationService.create(KeybindingService, window));
        this.serviceStorage.set(IContextMenuService, this.instantiationService.create(ContextMenuService));

        this.serviceStorage.set(IMe5DataService, this.instantiationService.create(Me5DataService));

        this.editor = this.instantiationService.create(EditorPart);
        this.serviceStorage.set(IEditorService, this.editor);
        
        this.sidebar = this.instantiationService.create(SidebarPart);

        this.serviceStorage.set(ICompositeViewService, this.instantiationService.create(CompositeViewService, this.sidebar));

        this.title = this.instantiationService.create(TitlePart);
        this.serviceStorage.set(ITitlePartService, this.title);

        this.statusbar = this.instantiationService.create(StatusbarPart);
        this.serviceStorage.set(IStatusbarService, this.statusbar);
    }

    private createWorkbench() {
        this.workbenchContainer = $('.workbench-container');
        this.workbench = $().div({
            class: 'workbench'
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
        this.workbenchLayout = new WorkbenchLayout(
            $(this.container),
            this.workbench,
            {
                title: this.title,
                sidebar: this.sidebar,
                editor: this.editor,
                statusbar: this.statusbar,
            });
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