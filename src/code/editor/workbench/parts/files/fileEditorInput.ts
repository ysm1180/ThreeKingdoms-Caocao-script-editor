import * as path from 'path';
import { IEditorInput } from '../../../../platform/editor/editor';
import { TextFileEditor } from '../../browser/parts/editor/textFileEditor';
import { Files } from '../../../../platform/files/file';
import { ControlEditor } from '../../browser/parts/editor/controlEditor';
import { EditorInput } from '../../common/editor';
import { IInstantiationService } from '../../../../platform/instantiation/instantiationService';
import { TextFileEditorModel } from '../../services/textfile/textFileEditorModel';

export class FileEditorInput extends EditorInput {
    protected resource: string;
    protected name: string;

    constructor(
        resource: string,
        name: string,
        @IInstantiationService private instantiationService: IInstantiationService,
    ) {
        super();

        this.resource = resource;
        this.name = name;
    }

    public getName(): string {
        return this.name;
    }

    public getId(): string {
        return this.resource;
    }

    public matches(other: IEditorInput) {
        if (this === other) {
            return true;
        }

        return this.getId() === other.getId();
    }

    public resolve(): Promise<TextFileEditorModel> {
        return Promise.resolve().then(() => {
            let model: TextFileEditorModel = this.instantiationService.create(TextFileEditorModel, this.resource);
            let modelPromise = model.load();

            return modelPromise;
        });
    }

    public getPreferredEditorId(): string {
        if (this.resource) {
            const ext = path.extname(this.resource).slice(1);
            if (ext === Files.dlg) {
                return ControlEditor.ID;
            }
        }

        return TextFileEditor.ID;
    }
}