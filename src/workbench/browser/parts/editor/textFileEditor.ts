import { DomBuilder } from '../../../../base/browser/domBuilder';
import { CodeEditor } from '../../../../editor/browser/codeEditor';
import { IDimension } from '../../../../editor/common/editorCommon';
import { IEditorInput } from '../../../../platform/editor/editor';
import { IInstantiationService } from '../../../../platform/instantiation/instantiation';
import { TextFileEditorModel } from '../../../services/textfile/textFileEditorModel';
import { BaseEditor } from './baseEditor';

export class TextFileEditor extends BaseEditor {
  static ID = 'editor.texteditor';

  private editorControl: CodeEditor;

  constructor(@IInstantiationService private instantiationService: IInstantiationService) {
    super(TextFileEditor.ID);
  }

  public create(parent: DomBuilder) {
    super.create(parent);

    this.createEditor(parent);
  }

  private createEditor(parent: DomBuilder) {
    this.editorControl = this.instantiationService.create(CodeEditor, parent.getHTMLElement());
  }

  public setInput(input: IEditorInput, refresh?: boolean): Promise<void> {
    if (!input) {
      return Promise.resolve();
    }

    return super.setInput(input).then(() => {
      return input.resolve(refresh).then((model: TextFileEditorModel) => {
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
