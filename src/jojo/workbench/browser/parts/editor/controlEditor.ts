import { IEditorInput } from 'jojo/platform/editor/common/editor';
import { BaseEditor } from 'jojo/workbench/browser/parts/editor/baseEditor';

export class ControlEditor extends BaseEditor {
  static ID = 'editor.controleditor';

  constructor(id: string) {
    super(id);
  }

  public setInput(input: IEditorInput): Promise<void> {
    if (!input) {
      return Promise.resolve();
    }

    return input.resolve();
  }

  public layout(): void {
    return;
  }
}
