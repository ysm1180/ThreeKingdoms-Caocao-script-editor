import { $, DomBuilder } from '../../../../../base/browser/domBuilder';
import { BaseEditor } from './baseEditor';
import { ResourceFileEditorModel } from './resourceFileEditorModel';
import { BinaryResourceViewer } from './resourceViewer';
import { IDimension } from '../../../../common/editorCommon';
import { ResourceEditorInput } from '../../../common/editor/resourceEditorInput';

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

    public setInput(input: ResourceEditorInput): Promise<void> {
        if (!input) {
            this.viewer.hide();
            return Promise.resolve();
        }

        return input.resolve().then((model: ResourceFileEditorModel) => {
            if (!(model instanceof ResourceFileEditorModel)) {
                return;
            }

            this.viewer.show();

            BinaryResourceViewer.show(
                { resource: model.getResource() },
                this.viewer
            );
        });
    }

    public layout(dimension: IDimension): void {

    }

    public dispose() {
        if (this.viewer) {
            this.viewer.destroy();
        }

        super.dispose();
    }
}