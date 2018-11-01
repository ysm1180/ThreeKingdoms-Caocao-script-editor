import { ResourceModel } from '../../../../common/resourceModel';
import { ResourceFileService } from '../../../services/resourceFile/resourceFileService';
import { IRawResourceContent } from '../../../services/textfile/textfiles';
import { ResourceBufferFactory } from '../../../../common/model/resourceBufferBuilder';
import { IResourceFileSerivce } from '../../../services/resourceFile/resourcefiles';
import { IEditorModel } from '../../../services/files/files';

export class ResourceFileEditorModel implements IEditorModel {
    private _resourceModel: ResourceModel;

    constructor(
        private resource: string,
        @IResourceFileSerivce private resourceFileService: ResourceFileService,
    ) {
        this._resourceModel = null;
    }

    public get resourceModel(): ResourceModel {
        return this._resourceModel;
    }

    public getResource(): string {
        return this.resource;
    }

    public load(): Promise<ResourceFileEditorModel> {
        if (this._resourceModel) {
            return Promise.resolve(this);
        }

        return this.loadFromFile();
    }

    private loadFromFile(): Promise<ResourceFileEditorModel> {
        return this.resourceFileService.resolveRawContent(this.resource)
            .then((content) => this.doLoadWithContent(content),
                () => this.onHandleFailed());
    }

    private doLoadWithContent(content: IRawResourceContent): Promise<ResourceFileEditorModel> {
        return this.doCreateResourceModel(content.value);
    }

    private doCreateResourceModel(value: ResourceBufferFactory): Promise<ResourceFileEditorModel> {
        this.doCreateTextEditorModel(value);

        return Promise.resolve(this);
    }

    private doCreateTextEditorModel(value: ResourceBufferFactory): void {
        this._resourceModel = new ResourceModel(value.create());
    }

    public getCurrentData() {
        return this._resourceModel ? this._resourceModel.getCurrentData() : null;
    }

    public setDataIndex(index: number): void {
        if (this._resourceModel) {
            this._resourceModel.setDataIndex(index);
        }
    }

    private onHandleFailed() {
        console.error('Resource File Load Failed');
        return Promise.reject(null);
    }

    public dispose(): void {

    }
}
