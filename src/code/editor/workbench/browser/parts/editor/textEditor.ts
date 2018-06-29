import { BaseEditor } from 'code/editor/workbench/browser/parts/editor/baseEditor';
import { IEditorInput } from 'code/platform/editor/editor';
import { DomBuilder, $ } from 'code/base/browser/domBuilder';

export class TextEditor extends BaseEditor {
    static ID = 'editor.texteditor';

    private container: DomBuilder;

    constructor(id: string) {
        super(id);

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