import { IFileService } from '../files/files';
import { createMe5ResourceBufferFactoryFromStream } from '../../../common/resourceModel';
import { IRawResourceContent } from '../textfile/textfiles';
import { ResourceFileEditorModelManager } from './resourceFileEditorModelManager';
import { IInstantiationService } from '../../../../platform/instantiation/instantiationService';


export class ResourceFileService {
    private _models: ResourceFileEditorModelManager;

    constructor(
        @IFileService private fileService: IFileService,
        @IInstantiationService private instantiationService: IInstantiationService,
    ) {
        this._models = this.instantiationService.create(ResourceFileEditorModelManager);
    }

    public get models(): ResourceFileEditorModelManager {
        return this._models;
    }

    public resolveRawContent(resource: string): Promise<IRawResourceContent> {
        return this.fileService.resolveStreamContent(resource).then((streamContent) => {
            return createMe5ResourceBufferFactoryFromStream(streamContent.value).then(res => {
                const r: IRawResourceContent = {
                    value: res
                };
                return r;
            }, (err) => {
                console.log(err);
                return null;
            });
        });
    }
}