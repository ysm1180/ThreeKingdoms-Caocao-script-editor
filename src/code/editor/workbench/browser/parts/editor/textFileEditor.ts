import { BaseEditor } from './baseEditor';
import { IEditorInput } from '../../../../../platform/editor/editor';
import { DomBuilder, $ } from '../../../../../base/browser/domBuilder';

export class TextFileEditor extends BaseEditor {
    static ID = 'editor.texteditor';

    private container: DomBuilder;

    constructor() {
        super(TextFileEditor.ID);

        this.container = null;
    }

    public create(parent: DomBuilder) {
        super.create(parent);

        this.container = $().div({
            class: 'text-editor-container'
        });
        
        this.container.build(parent);
    }

    public setInput(input: IEditorInput): Promise<void> {
        if (!input) {
            return Promise.resolve();
        }

        return input.resolve().then(() => {
            
        });
    }

    public dispose() {
        if (this.container) {
            this.container.destroy();
        }

        super.dispose();
    }
}