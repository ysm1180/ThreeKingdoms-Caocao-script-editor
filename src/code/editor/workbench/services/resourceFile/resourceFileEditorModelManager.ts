import { IInstantiationService } from '../../../../platform/instantiation/instantiationService';
import { ResourceFileEditorModel } from '../../browser/parts/editor/resourceFileEditorModel';

export class ResourceFileEditorModelManager {
    private mapResourceModel: Map<String, ResourceFileEditorModel>;

    constructor(
        @IInstantiationService private instantiationService: IInstantiationService,
    ) {
        this.mapResourceModel = new Map<String, ResourceFileEditorModel>();
    }

    public get(resource: string): ResourceFileEditorModel {
        return this.mapResourceModel.get(resource);
    }

    public loadOrCreate(resource: string): Promise<ResourceFileEditorModel> {
        let model = this.get(resource);

        let modelLoadPromise: Promise<ResourceFileEditorModel>;
        if (model) {
            modelLoadPromise = Promise.resolve(model);
        } else {
            model = this.instantiationService.create(ResourceFileEditorModel, resource);
            modelLoadPromise = model.load();
        }

        return modelLoadPromise.then((model) => {
            this.mapResourceModel.set(resource, model);

            return model;
        });
    }
}