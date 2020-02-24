import { Disposable } from 'jojo/base/common/lifecycle';
import { EditorConfiguration } from 'jojo/editor/browser/config/configuration';
import { View } from 'jojo/editor/browser/view/view';
import { IDimension } from 'jojo/editor/common/editorCommon';
import { TextModel } from 'jojo/editor/common/textModel';
import { ViewModel } from 'jojo/editor/common/viewModel/viewModelImpl';

export class CodeEditor extends Disposable {
  private domElement: HTMLElement;
  private view: View;

  protected viewModel: ViewModel;
  protected model: TextModel;

  protected readonly configuration: EditorConfiguration;

  constructor(parent: HTMLElement) {
    super();

    this.domElement = parent;
    this.configuration = new EditorConfiguration(this.domElement);
  }

  public setModel(model: TextModel) {
    if (this.model === model) {
      return;
    }

    this._detachModel();
    this._attachModel(model);
  }

  private _attachModel(model: TextModel) {
    this.model = model;

    if (this.model) {
      this.viewModel = new ViewModel(this.configuration, this.model);

      this._createView();

      this.domElement.appendChild(this.view.domNode.domNode);

      this.view.render();
    }
  }

  protected _detachModel() {
    let removeDomNode: HTMLElement = null;

    if (this.view) {
      this.view.dispose();
      removeDomNode = this.view.domNode.domNode;
      this.view = null;
    }

    if (removeDomNode) {
      this.domElement.removeChild(removeDomNode);
    }

    if (this.viewModel) {
      this.viewModel.dispose();
      this.viewModel = null;
    }

    this.model = null;
  }

  private _createView(): void {
    this.view = new View(this.configuration, this.viewModel);
  }

  public render() {
    if (!this.view) {
      return;
    }

    this.view.render();
  }

  public layout(dimension?: IDimension): void {
    this.configuration.observeReferenceDomElement(dimension);
    this.render();
  }

  public dispose(): void {
    this._detachModel();

    super.dispose();
  }
}
