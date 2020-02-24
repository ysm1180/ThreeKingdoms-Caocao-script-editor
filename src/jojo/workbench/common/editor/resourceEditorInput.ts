import { IDisposable } from 'base/common/lifecycle';
import { IEditorInput } from 'jojo/platform/editor/common/editor';
import { ResourceEditor } from 'workbench/browser/parts/editor/resourceEditor';
import { EditorInput } from 'workbench/common/editor';
import { BinaryFileEditorModel } from 'workbench/services/binaryfile/binaryFileEditorModel';
import { IBinaryFileService } from 'workbench/services/binaryfile/binaryFiles';
import { BinaryFileService } from 'workbench/services/binaryfile/binaryFileService';

export class ResourceEditorInput extends EditorInput {
  private toUnbind: IDisposable[];

  constructor(
    private resource: string,
    private name: string,
    @IBinaryFileService private binaryFileService: BinaryFileService
  ) {
    super();

    this.toUnbind = [];

    this._registerListeners();
  }

  private _registerListeners(): void {
    this.toUnbind.push(this.binaryFileService.models.onModelLoading.add(() => this._onModelLoading()));
    this.toUnbind.push(this.binaryFileService.models.onModelLoaded.add(() => this._onModelLoaded()));
    this.toUnbind.push(this.binaryFileService.models.onModelSaving.add(() => this._onModelSaving()));
    this.toUnbind.push(this.binaryFileService.models.onModelSaved.add(() => this._onModelSaved()));
  }

  private _onModelLoading() {
    this.onChangedState.fire();
  }

  private _onModelLoaded() {
    this.onChangedState.fire();
  }

  private _onModelSaving() {
    this.onChangedState.fire();
    this.onSaving.fire();
  }

  private _onModelSaved() {
    this.onChangedState.fire();
    this.onSaved.fire();
  }

  public getResource(): string {
    return this.resource;
  }

  public getName(): string {
    return this.name;
  }

  public getPreferredEditorId(): string {
    return ResourceEditor.ID;
  }

  public isSaving(): boolean {
    const model = this.binaryFileService.models.get(this.resource);
    if (model) {
      return model.isSaving();
    }

    return false;
  }

  public isLoaded(): boolean {
    return !this.binaryFileService.models.isLoading(this.resource);
  }

  public matches(other: IEditorInput): boolean {
    if (this === other) {
      return true;
    }

    return this.resource === other.getResource();
  }

  public resolve(refresh?: boolean): Promise<BinaryFileEditorModel> {
    return Promise.resolve().then(() => {
      return this.binaryFileService.models.loadOrCreate(this.resource, refresh);
    });
  }
}
