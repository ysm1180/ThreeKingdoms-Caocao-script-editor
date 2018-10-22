import { IEditorInput } from '../../../../platform/editor/editor';
import { ResourceViewEditor } from '../../browser/parts/editor/resourceViewEditor';
import { IInstantiationService } from '../../../../platform/instantiation/instantiationService';
import { ResourceFileEditorModel } from '../../browser/parts/editor/editorDataModel';
import { encodeToBase64 } from '../../../../base/common/encode';
import { EditorInput } from '../editor';

export class ResourceEditorInput extends EditorInput {
    constructor(
        private resource: string,
        private name: string,
        private data: Uint8Array,
        @IInstantiationService private instantiationService: IInstantiationService,
    ) {
        super();
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

    public resolve(): Promise<ResourceFileEditorModel> {
        return Promise.resolve().then(() => {
            if (this.data) {
                const base64 = encodeToBase64(this.data);
                return this.instantiationService.create(ResourceFileEditorModel, base64);
            }

            return null;
        });
    }
}