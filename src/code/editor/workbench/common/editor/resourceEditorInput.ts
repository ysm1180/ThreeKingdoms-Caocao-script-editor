import { IEditorInput } from '../../../../platform/editor/editor';
import { ResourceViewEditor } from '../../browser/parts/editor/resourceViewEditor';
import { ResourceFileEditorModel } from '../../browser/parts/editor/resourceFileEditorModel';
import { EditorInput } from '../editor';
import { ResourceFileService } from '../../services/resourceFile/resourceFileService';
import { IResourceFileSerivce } from '../../services/resourceFile/resourcefiles';

export class ResourceEditorInput extends EditorInput {
    constructor(
        private resource: string,
        private name: string,
        @IResourceFileSerivce private resourceFileService: ResourceFileService,
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
            return this.resourceFileService.models.loadOrCreate(this.resource);
        });
    }
}