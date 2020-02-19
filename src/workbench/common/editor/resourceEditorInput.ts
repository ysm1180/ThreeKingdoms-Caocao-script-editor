import { IDisposable } from '../../../base/common/lifecycle';
import { IEditorInput } from '../../../platform/editor/editor';
import { ResourceFileEditorModel } from '../../browser/parts/editor/resourceFileEditorModel';
import { ResourceEditor } from '../../browser/parts/editor/resourceViewEditor';
import { IResourceFileService } from '../../services/resourceFile/resourcefiles';
import { ResourceFileService } from '../../services/resourceFile/resourceFileService';
import { EditorInput } from '../editor';

export class ResourceEditorInput extends EditorInput {
  private toUnbind: IDisposable[];

  constructor(
    private resource: string,
    private name: string,
    @IResourceFileService private resourceFileService: ResourceFileService
  ) {
    super();

    this.toUnbind = [];

    this._registerListeners();
  }

  private _registerListeners(): void {
    this.toUnbind.push(this.resourceFileService.models.onModelLoading.add(() => this._onModelLoading()));
    this.toUnbind.push(this.resourceFileService.models.onModelLoaded.add(() => this._onModelLoaded()));
    this.toUnbind.push(this.resourceFileService.models.onModelSaving.add(() => this._onModelSaving()));
    this.toUnbind.push(this.resourceFileService.models.onModelSaved.add(() => this._onModelSaved()));
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
    const model = this.resourceFileService.models.get(this.resource);
    if (model) {
      return model.isSaving();
    }

    return false;
  }

  public isLoaded(): boolean {
    return !this.resourceFileService.models.isLoading(this.resource);
  }

  public matches(other: IEditorInput): boolean {
    if (this === other) {
      return true;
    }

    return this.resource === other.getResource();
  }

  public resolve(refresh?: boolean): Promise<ResourceFileEditorModel> {
    return Promise.resolve().then(() => {
      return this.resourceFileService.models.loadOrCreate(this.resource, refresh);
    });
  }
}
