import { IInstantiationService } from '../../../../platform/instantiation/instantiationService';
import { ResourceFileEditorModel } from '../../browser/parts/editor/resourceFileEditorModel';

export class ResourceFileEditorModelManager {
    private mapResourceToModel: Map<String, ResourceFileEditorModel>;
    private mapResourceToPendingModelLoaders: Map<String, Promise<ResourceFileEditorModel>>;

    constructor(
        @IInstantiationService private instantiationService: IInstantiationService,
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
        }

		this.mapResourceToPendingModelLoaders.set(resource, modelLoadPromise);

        return modelLoadPromise.then((model) => {
            this._add(resource, model);

            this.mapResourceToPendingModelLoaders.delete(resource);

            return model;
        });
    }

    private _add(resource: string, model: ResourceFileEditorModel)  {
        const knownModel = this.mapResourceToModel.get(resource);
		if (knownModel === model) {
			return;
        }
        
        this.mapResourceToModel.set(resource, model);
    }
}