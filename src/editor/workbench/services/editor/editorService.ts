import * as path from 'path';

import {
    IEditorInput, IResourceInput, IUntitleResourceInput
} from '../../../../platform/editor/editor';
import { decorator } from '../../../../platform/instantiation/instantiation';
import { IInstantiationService } from '../../../../platform/instantiation/instantiationService';
import { EditorPart } from '../../browser/parts/editor/editorPart';
import { EditorInput } from '../../common/editor';
import { ResourceEditorInput } from '../../common/editor/resourceEditorInput';
import { FileEditorInput } from '../../parts/files/fileEditorInput';

export const IWorkbenchEditorService = decorator<WorkbenchEditorService>(
    'workbenchEditorService'
);

type IResourceInputType = IResourceInput | IUntitleResourceInput;

export class WorkbenchEditorService {
    private editorPart: EditorPart;

    constructor(
        editorPart: EditorPart,
        @IInstantiationService
        private instantiationService: IInstantiationService
    ) {
        this.editorPart = editorPart;
    }

    public getActiveEditorInput(): IEditorInput {
        return this.editorPart.getActiveEditorInput();
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
            return this.instantiationService.create(
                ResourceEditorInput,
                resource,
                label
            );
        }

        return this.instantiationService.create(
            FileEditorInput,
            resource,
            label
        );
    }

    public openEditors(inputs: IResourceInputType[]) {
        const editors = inputs.map(input => this.createInput(input));

        return this.editorPart.openEditors(editors);
    }

    public refresh() {
        const activeEditorInput = this.editorPart.getActiveEditorInput();
        const currentEditor = this.editorPart.getCurrentEditor();

        this.editorPart.setInput(activeEditorInput, currentEditor);
    }
}
