import { BaseEditor } from './baseEditor';
import { IEditorInput } from '../../../../../platform/editor/editor';
import { DomBuilder, $ } from '../../../../../base/browser/domBuilder';
import { CodeEditor } from '../../../../browser/codeEditor';
import { IInstantiationService } from '../../../../../platform/instantiation/instantiationService';
import { TextFileEditorModel } from '../../../services/textfile/textFileEditorModel';
import { IDimension } from 'code/editor/common/editorCommon';


export class TextFileEditor extends BaseEditor {
    static ID = 'editor.texteditor';

    private container: DomBuilder;
    private editorControl: CodeEditor;

    constructor(
        @IInstantiationService private instantiationService: IInstantiationService,
    ) {
        super(TextFileEditor.ID);

        this.container = null;
    }

    public create(parent: DomBuilder) {
        super.create(parent);

        this.createEditor(parent);
        
        this.container.build(parent);
    }

    private createEditor(parent: DomBuilder) {
        this.container = $().div({
            class: 'text-editor-container'
        });

        this.editorControl = this.instantiationService.create(CodeEditor, this.container.getHTMLElement());
    }

    public setInput(input: IEditorInput): Promise<void> {
        if (!input) {
            return Promise.resolve();
        }

        return input.resolve().then((model: TextFileEditorModel) => {
            const modelPromise = model.load();

            return modelPromise.then((model: TextFileEditorModel) => {
                this.editorControl.setModel(model.textModel);
            });
        });
    }

    public layout(dimension: IDimension): void {
        this.editorControl.layout(dimension);
    }

    public dispose() {
        if (this.container) {
            this.container.destroy();
        }

        super.dispose();
    }
}