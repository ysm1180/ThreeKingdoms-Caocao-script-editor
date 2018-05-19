import { DomBuilder } from 'code/base/browser/domBuilder';
import { Part } from 'code/editor/workbench/browser/part';
import { TabControl } from 'code/editor/workbench/browser/parts/tabControl';
import { Editors } from 'code/editor/workbench/browser/parts/editor/editors';
import { IEditorService, EditorPart } from 'code/editor/workbench/browser/parts/editor/editorPart';
import { IInstantiationService, InstantiationService } from 'code/platform/instantiation/instantiationService';
import { decorator } from 'code/platform/instantiation/instantiation';

export const ITitlePartService = decorator<TitlePart>('titlePart');

export class TitlePart extends Part {
    private tab: TabControl;

    constructor(
        @IEditorService private editorService: EditorPart,
        @IInstantiationService private instantiationService: InstantiationService
    ) {
        super();

    }

    public create(parent: DomBuilder) {
        super.create(parent);

        this.tab = this.instantiationService.create(TabControl);
        this.tab.create(this.getContentArea().getHTMLElement());

        this.editorService.onEditorChanged.add(() => {
            this.update(this.editorService.getEditors());
        });
    }

    public update(context: Editors): void {
        this.tab.setContext(context);
        this.tab.refresh();
    }
}