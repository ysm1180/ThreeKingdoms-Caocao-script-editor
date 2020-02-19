import { $, DomBuilder } from '../../../../base/browser/domBuilder';
import { Event } from '../../../../base/common/event';
import { IDimension } from '../../../../editor/common/editorCommon';
import { IInstantiationService } from '../../../../platform/instantiation/instantiation';
import { IPartService } from '../../../services/part/partService';
import { CompositViewRegistry, CompositeView } from '../../compositeView';
import { Part } from '../../part';
import { EditorGroup } from '../editor/editorGroup';
import { EditorPart, IEditorGroupService } from '../editor/editorPart';

export class SidebarPart extends Part {
  private instantiatedComposites: CompositeView[];
  private activeComposite: CompositeView;

  private group: EditorGroup;

  private mapCompositeToCompositeContainer: { [id: string]: DomBuilder };

  public onDidCompositeOpen = new Event<CompositeView>();
  public onDidCompositeClose = new Event<CompositeView>();

  constructor(
    @IPartService private partService: IPartService,
    @IEditorGroupService private editorService: EditorPart,
    @IInstantiationService private instantiationService: IInstantiationService
  ) {
    super();

    this.activeComposite = null;
    this.instantiatedComposites = [];
    this.mapCompositeToCompositeContainer = {};

    this.group = this.editorService.getEditorGroup();
    this.registerDispose(
      this.editorService.onEditorChanged.add(() => {
        this._onEditorChanged();
      })
    );
  }

  private _onEditorChanged() {
    const activeInput = this.group.activeEditorInput;
    if (!activeInput) {
      this._hideActiveComposite();
      this.partService.setSideBarHidden(true);
      return;
    }

    const descriptors = CompositViewRegistry.getCompositeViewDescriptors(activeInput);
    if (descriptors.length === 0) {
      this._hideActiveComposite();
      this.partService.setSideBarHidden(true);
      return;
    }

    for (let i = 0; i < descriptors.length; i++) {
      const id = descriptors[i].id;
      this.openCompositeView(id);
    }
    this.partService.setSideBarHidden(false);
  }

  public openCompositeView(id: string) {
    const composite = this._doOpenCompositeView(id);

    this.onDidCompositeOpen.fire(composite);

    this.activeComposite = composite;
  }

  private _doOpenCompositeView(id: string): CompositeView {
    if (this.activeComposite && this.activeComposite.getId() === id) {
      return this.activeComposite;
    }

    if (this.activeComposite) {
      this._hideActiveComposite();
    }

    const composite = this._createCompositeView(id);
    if (!composite) {
      return null;
    }

    let compositeContainer = this.mapCompositeToCompositeContainer[composite.getId()];
    if (!compositeContainer) {
      compositeContainer = $().div({
        class: 'composite',
        id: composite.getId(),
      });

      this.mapCompositeToCompositeContainer[composite.getId()] = compositeContainer;

      composite.create(compositeContainer);
    }

    compositeContainer.build(this.getContentArea());
    compositeContainer.show();

    return composite;
  }

  private _createCompositeView(id: string): CompositeView {
    for (let i = 0; i < this.instantiatedComposites.length; i++) {
      if (this.instantiatedComposites[i].getId() === id) {
        return this.instantiatedComposites[i];
      }
    }

    const compositeDescriptor = CompositViewRegistry.getCompositeViewDescriptor(id);
    if (compositeDescriptor) {
      const composite = this.instantiationService.create(compositeDescriptor.ctor);
      this.instantiatedComposites.push(composite);
      return composite;
    }

    return null;
  }

  private _hideActiveComposite() {
    if (!this.activeComposite) {
      return;
    }

    const composite = this.activeComposite;
    this.activeComposite = null;

    const compositeContainer = this.mapCompositeToCompositeContainer[composite.getId()];
    compositeContainer.offDOM();
    compositeContainer.hide();

    this.onDidCompositeClose.fire(composite);
  }

  public layout(size: IDimension) {
    super.layout(size);

    if (this.activeComposite) {
      this.activeComposite.layout();
    }
  }

  public dispose() {
    if (this.activeComposite) {
      this.activeComposite.dispose();
    }

    super.dispose();
  }
}
