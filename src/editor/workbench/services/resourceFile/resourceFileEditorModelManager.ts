import { Event } from '../../../../base/common/event';
import { StateChange } from '../../../../platform/files/files';
import { IInstantiationService } from '../../../../platform/instantiation/instantiationService';
import { ResourceFileEditorModel } from '../../browser/parts/editor/resourceFileEditorModel';

export class ResourceFileEditorModelManager {
  private mapResourceToModel: Map<String, ResourceFileEditorModel>;
  private mapResourceToPendingModelLoaders: Map<String, Promise<ResourceFileEditorModel>>;

  public onModelSaving = new Event<void>();
  public onModelSaved = new Event<void>();
  public onModelLoading = new Event<void>();
  public onModelLoaded = new Event<void>();

  constructor(
    @IInstantiationService
    private instantiationService: IInstantiationService
  ) {
    this.mapResourceToModel = new Map<String, ResourceFileEditorModel>();
    this.mapResourceToPendingModelLoaders = new Map<String, Promise<ResourceFileEditorModel>>();
  }

  public get(resource: string): ResourceFileEditorModel {
    return this.mapResourceToModel.get(resource);
  }

  public loadOrCreate(resource: string, refresh?: boolean): Promise<ResourceFileEditorModel> {
    const pendingLoad = this.mapResourceToPendingModelLoaders.get(resource);
    if (pendingLoad) {
      return pendingLoad;
    }

    let model = this.get(resource);

    let modelLoadPromise: Promise<ResourceFileEditorModel>;
    if (model) {
      if (!refresh) {
        modelLoadPromise = Promise.resolve(model);
      } else {
        modelLoadPromise = model.load();
      }
    } else {
      model = this.instantiationService.create(ResourceFileEditorModel, resource);
      modelLoadPromise = model.load();

      model.onDidStateChanged.add((state) => {
        switch (state) {
          case StateChange.DIRTY:
            break;
          case StateChange.SAVED:
            this.onModelSaved.fire();
            break;
          case StateChange.SAVING:
            this.onModelSaving.fire();
            break;
        }
      });
    }

    this.mapResourceToPendingModelLoaders.set(resource, modelLoadPromise);

    this.onModelLoading.fire();

    return modelLoadPromise.then((model) => {
      this._add(resource, model);

      this.mapResourceToPendingModelLoaders.delete(resource);

      this.onModelLoaded.fire();

      return model;
    });
  }

  public isLoading(resource: string): boolean {
    const pendingLoad = this.mapResourceToPendingModelLoaders.get(resource);
    return !!pendingLoad;
  }

  private _add(resource: string, model: ResourceFileEditorModel) {
    const knownModel = this.mapResourceToModel.get(resource);
    if (knownModel === model) {
      return;
    }

    this.mapResourceToModel.set(resource, model);
  }
}
