import { DomBuilder } from 'jojo/base/browser/domBuilder';
import { CodeEditor } from 'jojo/editor/browser/codeEditor';
import { IDimension } from 'jojo/editor/common/editorCommon';
import { IEditorInput } from 'jojo/platform/editor/common/editor';
import { IInstantiationService } from 'jojo/platform/instantiation/common/instantiation';
import { BaseEditor } from 'jojo/workbench/browser/parts/editor/baseEditor';
import { TextFileEditorModel } from 'jojo/workbench/services/textfile/textFileEditorModel';

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
