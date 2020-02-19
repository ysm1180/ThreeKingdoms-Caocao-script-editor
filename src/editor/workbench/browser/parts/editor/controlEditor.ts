import { BaseEditor } from './baseEditor';
import { IEditorInput } from '../../../../../platform/editor/editor';

export class ControlEditor extends BaseEditor {
  static ID = 'editor.controleditor';

  constructor(id: string) {
    super(id);
  }

  public setInput(input: IEditorInput): Promise<void> {
    if (!input) {
      return Promise.resolve();
    }

    return input.resolve().then(() => {});
  }

  public layout(): void {}
}
