import { $, DomBuilder } from '../../../../base/browser/domBuilder';
import { IDimension } from '../../../../editor/common/editorCommon';
import { ResourceEditorInput } from '../../../common/editor/resourceEditorInput';
import { BaseEditor } from './baseEditor';
import { ResourceFileEditorModel } from './resourceFileEditorModel';
import { ResourceViewer } from './resourceViewer';

export class ResourceEditor extends BaseEditor {
  static ID = 'editor.resourceEditor';

  private viewer: DomBuilder;

  constructor() {
    super(ResourceEditor.ID);
  }

  public create(parent: DomBuilder) {
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

      return input.resolve(refresh).then((editorModel: ResourceFileEditorModel) => {
        if (!(editorModel instanceof ResourceFileEditorModel)) {
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
