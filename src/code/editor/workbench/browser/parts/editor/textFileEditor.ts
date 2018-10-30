import { BaseEditor } from './baseEditor';
import { IEditorInput } from '../../../../../platform/editor/editor';
import { DomBuilder } from '../../../../../base/browser/domBuilder';
import { CodeEditor } from '../../../../browser/codeEditor';
import { IInstantiationService } from '../../../../../platform/instantiation/instantiationService';
import { TextFileEditorModel } from '../../../services/textfile/textFileEditorModel';
import { IDimension } from '../../../../common/editorCommon';


export class TextFileEditor extends BaseEditor {
    static ID = 'editor.texteditor';

    private editorControl: CodeEditor;

    constructor(
        @IInstantiationService private instantiationService: IInstantiationService,
    ) {
        super(TextFileEditor.ID);
    }

    public create(parent: DomBuilder) {
        super.create(parent);

        this.createEditor(parent);
    }

    private createEditor(parent: DomBuilder) {
        this.editorControl = this.instantiationService.create(CodeEditor, parent.getHTMLElement());
    }

    public setInput(input: IEditorInput): Promise<void> {
        if (!input) {
            return Promise.resolve();
        }
        
        return super.setInput(input).then(() => {
            return input.resolve().then((model: TextFileEditorModel) => {
                const modelPromise = model.load();
    
                return modelPromise.then((model: TextFileEditorModel) => {
                    this.editorControl.setModel(model.model);
                });
            });
        });
    }

    public layout(dimension?: IDimension): void {
        this.editorControl.layout(dimension);
    }

    public dispose() {
        this.editorControl.dispose();

        super.dispose();
    }
}