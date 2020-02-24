import { $, DomBuilder } from 'jojo/base/browser/domBuilder';
import { IDimension } from 'jojo/editor/common/editorCommon';
import { BaseEditor } from 'jojo/workbench/browser/parts/editor/baseEditor';
import { ResourceViewer } from 'jojo/workbench/browser/parts/editor/resourceViewer';
import { ResourceEditorInput } from 'jojo/workbench/common/editor/resourceEditorInput';
import { BinaryFileEditorModel } from 'jojo/workbench/services/binaryfile/binaryFileEditorModel';

export class ResourceEditor extends BaseEditor {
  static ID = 'editor.resourceEditor';

  private viewer: DomBuilder;

  constructor() {
    super(ResourceEditor.ID);
  }

  public create(parent: DomBuilder): void {
    super.create(parent);

    this.viewer = $().div({
      class: 'resource-editor',
    });

    this.viewer.build(parent);
  }

  public setInput(input: ResourceEditorInput, refresh?: boolean): Promise<void> {
    return super.setInput(input).then(() => {
      if (!input) {
        this.viewer.hide();
        return Promise.resolve();
      }

      return input.resolve(refresh).then((editorModel: BinaryFileEditorModel) => {
        if (!(editorModel instanceof BinaryFileEditorModel)) {
          return;
        }

        const hasInput = !!this.input;
        if (hasInput && editorModel.getResource() !== this.input.getResource()) {
          return;
        }

        const resource = editorModel.resourceModel.getCurrentData();
        if (resource) {
          this.viewer.show();

          ResourceViewer.show({ resource }, this.viewer);
        } else {
          this.viewer.hide();
        }
      });
    });
  }

  public layout(dimension: IDimension): void {}

  public dispose() {
    if (this.viewer) {
      this.viewer.destroy();
    }

    super.dispose();
  }
}
