import { IEditorInput } from '../../../../platform/editor/editor';
import { ResourceViewEditor } from '../../browser/parts/editor/resourceViewEditor';
import { IInstantiationService } from '../../../../platform/instantiation/instantiationService';
import { ResourceFileEditorDataModel } from '../../browser/parts/editor/editorDataModel';
import { encodeToBase64 } from '../../../../base/common/encode';

export class ResourceEditorInput implements IEditorInput {
    constructor(
        private resource: string,
        private name: string,
        private data: Uint8Array,
        @IInstantiationService private instantiationService: IInstantiationService,
    ) {

    }

    public getId(): string {
        return this.resource;
    }

    public getName(): string {
        return this.name;
    }

    public getPreferredEditorId(): string {
        return ResourceViewEditor.ID;
    }

    public matches(other: IEditorInput): boolean {
        if (this === other) {
            return true;
        }

        return this.resource === other.getId();
    }

    public resolve(): Promise<ResourceFileEditorDataModel> {
        return Promise.resolve().then(() => {
            if (this.data) {
                const base64 = encodeToBase64(this.data);
                return this.instantiationService.create(ResourceFileEditorDataModel, base64);
            }

            return null;
        });
    }
}