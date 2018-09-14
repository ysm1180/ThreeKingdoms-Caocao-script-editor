import { ipcRenderer } from 'electron';
import { IEditorInput, IResourceInput } from '../../platform/editor/editor';
import { IOpenFileRequest } from '../../platform/windows/windows';
import { IInstantiationService } from '../../platform/instantiation/instantiationService';
import { IWorkbenchEditorService, WorkbenchEditorService } from './services/editor/editorService';

export class ElectronWindow {
    constructor(
        @IWorkbenchEditorService private editorService: WorkbenchEditorService,
        @IInstantiationService private instantiationService: IInstantiationService,

    ) {
        this.registerListeners();
    }

    public registerListeners() {
        ipcRenderer.on('editor:openFiles', (e, data: IOpenFileRequest) => this.onOpenFiles(data));

        ipcRenderer.on('editor:saveFile', () => {
        });
    }

    private onOpenFiles(data: IOpenFileRequest): void {
        if (!data.files) {
            return;
        }

        const inputs: IResourceInput[] = [];
        inputs.push(...this.toInputs(data.files));
        if (inputs.length) {
            this.openResources(inputs);
        }
    }

    private toInputs(paths: string[]) {
        return paths.map((path) => {
            let input: IResourceInput = {
               resource: path, 
            };

            return input;
        });
    }

    private openResources(resources: IResourceInput[]) {
        if (resources.length === 1) {
            return this.editorService.openEditor(resources[0]);
        }

        return this.editorService.openEditors(resources);
    }

    private onSaveFile(input: IEditorInput): void {
        
    }
}