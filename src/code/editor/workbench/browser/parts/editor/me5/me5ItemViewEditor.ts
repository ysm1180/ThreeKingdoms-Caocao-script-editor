import { $, DomBuilder } from '../../../../../../base/browser/domBuilder';
import { IEditorInput } from '../../../../../../platform/editor/editor';
import { BaseEditor } from '../baseEditor';
import { BinaryDataEditorModel } from '../binaryDataEditorModel';
import { BinaryResourceViewer } from '../resourceViewer';

export const Me5ActiveItemKey = 'me5ActiveItem';

export class Me5ItemViewEditor extends BaseEditor {
    static ID = 'editor.me5ItemViewer';

    private viewer: DomBuilder;

    constructor(
    ) {
        super(Me5ItemViewEditor.ID);
    }

    public create(parent: DomBuilder) {
        super.create(parent);

        this.viewer = $().div({
            class: 'item-viewer-editor'
        });

        this.viewer.build(parent);
    }

    public setInput(input: IEditorInput): Promise<void> {
        if (!input) {
            this.viewer.hide();
            return Promise.resolve();
        }

        return input.resolve().then((data: BinaryDataEditorModel) => {
            if (!data || !(data instanceof BinaryDataEditorModel)) {
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