import { DomBuilder } from '../../../../base/browser/domBuilder';
import { Part } from '../part';
import { TabControl } from './tabControl';
import { IEditorService, EditorPart } from './editor/editorPart';
import { IInstantiationService, InstantiationService } from '../../../../platform/instantiation/instantiationService';
import { decorator, ServiceIdentifier } from '../../../../platform/instantiation/instantiation';

export const ITitlePartService: ServiceIdentifier<TitlePart> = decorator<TitlePart>('titlePart');

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

        const editors = this.editorService.getEditorGroup();
        this.tab.setContext(editors);
        editors.onEditorStateChanged.add(() => {
            this.update();
        });
    }

    public update(): void {
        this.tab.refresh();
    }
}