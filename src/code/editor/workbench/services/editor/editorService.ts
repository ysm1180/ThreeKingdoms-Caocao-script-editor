import * as path from 'path';
import { decorator } from '../../../../platform/instantiation/instantiation';
import { EditorPart } from '../../browser/parts/editor/editorPart';
import { IResourceInput, IEditorInput, IUntitleResourceInput } from '../../../../platform/editor/editor';
import { EditorInput } from '../../common/editor';
import { IInstantiationService } from '../../../../platform/instantiation/instantiationService';
import { FileEditorInput } from '../../parts/files/fileEditorInput';
import { ResourceEditorInput } from '../../common/editor/resourceEditorInput';

export const IWorkbenchEditorService = decorator<WorkbenchEditorService>('workbenchEditorService');

type IResourceInputType = IResourceInput | IUntitleResourceInput;

export class WorkbenchEditorService {
    private editorPart: EditorPart;

    constructor(
        editorPart: EditorPart,
        @IInstantiationService private instantiationService: IInstantiationService,
    ) {
        this.editorPart = editorPart;
    }

    public openEditor(input: IResourceInputType): Promise<any>;
    public openEditor(input: IEditorInput): Promise<any>;
    public openEditor(input: any): Promise<any> {
        if (!input) {
            return Promise.resolve(null);
        }

        if (input instanceof EditorInput) {
            return this.doOpenEditor(input);
        }

        const createdInput = this.createInput(input);
        if (createdInput) {
            return this.doOpenEditor(createdInput);
        }

        return Promise.resolve(null);
    }

    private doOpenEditor(input: IEditorInput);
    private doOpenEditor(input: any) {
        return this.editorPart.openEditor(input);
    }

    private createInput(input: IResourceInputType): EditorInput {
        if (!input.resource) {

        }

        let label: string = input.label;
        if (!label) {
            label = path.basename(input.resource);
        }

        return this.create(input.resource, label);
    }

    private create(resource: string, label: string): EditorInput {
        const ext = path.extname(resource);

        if (ext === '.me5') {
            return this.instantiationService.create(ResourceEditorInput, resource, label, null);
        }

        return this.instantiationService.create(FileEditorInput, resource, label);
    }

    public openEditors(inputs: IResourceInputType[]) {
        const editors = inputs.map((input) => this.createInput(input));

        return this.editorPart.openEditors(editors);
    }
}