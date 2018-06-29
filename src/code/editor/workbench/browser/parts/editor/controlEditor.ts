import { BaseEditor } from 'code/editor/workbench/browser/parts/editor/baseEditor';
import { IEditorInput } from 'code/platform/editor/editor';

export class ControlEditor extends BaseEditor{
    static ID = 'editor.controleditor';

    constructor(id: string) {
        super(id);
    }

    public setInput(input: IEditorInput): Promise<void> {
        if (!input) {
            return Promise.resolve();
        }

        return input.resolve().then(() => {
            
        });
    }
}