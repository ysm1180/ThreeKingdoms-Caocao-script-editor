import { $, DomBuilder } from 'jojo/base/browser/domBuilder';
import { ICommandService } from 'jojo/platform/commands/common/commands';
import { ContextKeyService } from 'jojo/platform/contexts/browser/contextKeyService';
import { IContextKeyService } from 'jojo/platform/contexts/common/contextKey';
import { ClassDescriptor } from 'jojo/platform/instantiation/common/descriptors';
import { IInstantiationService } from 'jojo/platform/instantiation/common/instantiation';
import { ServiceStorage } from 'jojo/platform/instantiation/common/serviceStorage';
import { IKeybindingService, KeybindingService } from 'jojo/platform/keybindings/keybindingService';
import { IStatusbarService } from 'jojo/platform/statusbar/common/statusbar';
import { ITreeService, TreeService } from 'jojo/platform/tree/treeService';
import { IWindowService } from 'jojo/platform/windows/common/windows';
import { WindowClientService } from 'jojo/platform/windows/node/windowsIpc';
import { WorkbenchLayout } from 'jojo/workbench/browser/layout';
import { EditorPart } from 'jojo/workbench/browser/parts/editor/editorPart';
import { SidebarPart } from 'jojo/workbench/browser/parts/sidebar/sidebarPart';
import { StatusbarPart } from 'jojo/workbench/browser/parts/statusbar/statusbarPart';
import { ITitlePartService, TitlePart } from 'jojo/workbench/browser/parts/titlebar/titlePart';
import { IBinaryDataService, IBinaryFileService } from 'jojo/workbench/services/binaryfile/binaryFiles';
import { CommandService } from 'jojo/workbench/services/commands/common/commandService';
import { ContextMenuService, IContextMenuService } from 'jojo/workbench/services/contextmenu/contextmenuService';
import { IWorkbenchEditorService, WorkbenchEditorService } from 'jojo/workbench/services/editor/editorService';
import { DialogService, IDialogService } from 'jojo/workbench/services/electron-browser/dialogService';
import { IFileService } from 'jojo/workbench/services/files/files';
import { FileService } from 'jojo/workbench/services/files/node/fileService';
import { IEditorGroupService } from 'jojo/workbench/services/group/editorGroupService';
import { Me5DataService } from 'jojo/workbench/services/me5/me5DataService';
import { Me5FileService } from 'jojo/workbench/services/me5/me5FileService';
import { IPartService } from 'jojo/workbench/services/part/partService';
import { ITextFileService } from 'jojo/workbench/services/textfile/textfiles';
import { TextFileService } from 'jojo/workbench/services/textfile/textFileService';
import { CompositeViewService, ICompositeViewService } from 'jojo/workbench/services/view/compositeViewService';

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
    this.serviceStorage.set(IBinaryFileService, new ClassDescriptor(Me5FileService));
    this.serviceStorage.set(IBinaryDataService, new ClassDescriptor(Me5DataService));

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
    this.workbench = $()
      .div({
        class: 'workbench nosidebar',
      })
      .appendTo(this.workbenchContainer);
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
      class: 'title',
    });
    this.titlePart.create(titleContainer);
  }

  private createSidebar(): void {
    const sidebarContainer = $(this.workbench).div({
      class: 'sidebar',
    });

    this.sidebarPart.create(sidebarContainer);
  }

  private createEditor(): void {
    const editorContainer = $(this.workbench).div({
      class: 'editor',
    });

    this.editorPart.create(editorContainer);
  }

  private createStatusbar(): void {
    const statusbarContainer = $(this.workbench).div({
      class: 'statusbar',
    });

    this.statusbarPart.create(statusbarContainer);
  }

  private createLayout(): void {
    this.workbenchLayout = this.instantiationService.create(WorkbenchLayout, $(this.container), this.workbench, {
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
