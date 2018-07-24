import { $, DomBuilder } from '../../../../../base/browser/domBuilder';
import { IEditorInput } from '../../../../../platform/editor/editor';
import { BaseEditor } from './baseEditor';
import { BinaryFileEditorDataModel } from './editorDataModel';
import { BinaryResourceViewer } from './resourceViewer';

export class ResourceViewEditor extends BaseEditor {
    static ID = 'editor.resourceViewerEditor';

    private viewer: DomBuilder;

    constructor(
    ) {
        super(ResourceViewEditor.ID);
    }

    public create(parent: DomBuilder) {
        super.create(parent);

        this.viewer = $().div({
            class: 'resource-viewer-editor'
        });

        this.viewer.build(parent);
    }

    public setInput(input: IEditorInput): Promise<void> {
        if (!input) {
            this.viewer.hide();
            return Promise.resolve();
        }

        return input.resolve().then((data: BinaryFileEditorDataModel) => {
            if (!data || !(data instanceof BinaryFileEditorDataModel)) {
                return;
            }

            this.viewer.show();

            BinaryResourceViewer.show(
                { resource: data.getResource() },
                this.viewer
            );
        });
    }

    public dispose() {
        if (this.viewer) {
            this.viewer.destroy();
        }

        super.dispose();
    }
}