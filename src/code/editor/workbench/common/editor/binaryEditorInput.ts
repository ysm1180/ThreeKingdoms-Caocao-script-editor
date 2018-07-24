import { IEditorInput } from '../../../../platform/editor/editor';
import { ResourceViewEditor } from '../../browser/parts/editor/binaryViewEditor';
import { IInstantiationService, InstantiationService } from '../../../../platform/instantiation/instantiationService';
import { BinaryFileEditorDataModel } from '../../browser/parts/editor/editorDataModel';
import { encodeToBase64 } from '../../../../base/common/encode';

export class BinaryFileEditorInput implements IEditorInput {
    constructor(
        private resource: string,
        private name: string,
        private data: Uint8Array,
        @IInstantiationService private instantiationService: InstantiationService,
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

    public resolve() {
        return Promise.resolve().then(() => {
            const base64 = encodeToBase64(this.data);
            return this.instantiationService.create(BinaryFileEditorDataModel, base64);
        });
    }
}