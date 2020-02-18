import { DomBuilder } from '../../../../base/browser/domBuilder';
import { decorator, ServiceIdentifier } from '../../../../platform/instantiation/instantiation';
import { IInstantiationService } from '../../../../platform/instantiation/instantiationService';
import { Part } from '../part';
import { EditorPart, IEditorGroupService } from './editor/editorPart';
import { TabControl } from './tabControl';

export const ITitlePartService: ServiceIdentifier<TitlePart> = decorator<
    TitlePart
>('titlePart');

export class TitlePart extends Part {
    private tab: TabControl;

    constructor(
        @IEditorGroupService private editorService: EditorPart,
        @IInstantiationService
        private instantiationService: IInstantiationService
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
