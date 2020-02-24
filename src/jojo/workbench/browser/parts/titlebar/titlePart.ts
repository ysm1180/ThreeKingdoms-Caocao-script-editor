import { DomBuilder } from 'jojo/base/browser/domBuilder';
import { IInstantiationService, decorator } from 'jojo/platform/instantiation/common/instantiation';
import { Part } from 'jojo/workbench/browser/part';
import { TabControl } from 'jojo/workbench/browser/parts/editor/tabControl';
import { IEditorGroupService } from 'jojo/workbench/services/group/editorGroupService';

export const ITitlePartService = decorator<TitlePart>('titlePart');

export class TitlePart extends Part {
  private tab: TabControl;

  constructor(
    @IEditorGroupService private editorService: IEditorGroupService,
    @IInstantiationService private instantiationService: IInstantiationService
  ) {
    super();
  }

  public create(parent: DomBuilder) {
    super.create(parent);

    this.tab = this.instantiationService.create(TabControl);
    this.tab.create(this.getContentArea().getHTMLElement());

    const editors = this.editorService.getEditorGroup();
    this.tab.setContext(editors);

    this.editorService.onEditorChanged.add(() => {
      this.update();
    });
  }

  public update(): void {
    this.tab.refresh();
  }
}
