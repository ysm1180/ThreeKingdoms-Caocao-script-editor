import { ipcRenderer } from 'electron';
import { IEditorInput } from '../../platform/editor/editor';
import { IOpenFileRequest } from '../../platform/windows/windows';
import { FileEditorInput } from './parts/files/fileEditorInput';
import { IInstantiationService, InstantiationService } from '../../platform/instantiation/instantiationService';
import { IEditorService, EditorPart } from './browser/parts/editor/editorPart';

export class ElectronWindow {
    constructor(
        @IEditorService private editorService: EditorPart,
        @IInstantiationService private instantiationService: InstantiationService,

    ) {
        this.registerListeners();
    }

    public registerListeners() {
        ipcRenderer.on('editor:openFiles', (e, data: IOpenFileRequest) => this.onOpenFiles(data));

        ipcRenderer.on('editor:saveFile', () => {
            const input = this.editorService.getEditors().activeEditor;
            if (!input) {
                return;
            }

            this.onSaveFile(input);
        });
    }

    private onOpenFiles(data: IOpenFileRequest): void {
        if (!data.files) {
            return;
        }

        for (let i = 0; i < data.files.length; i++) {
            const input = this.instantiationService.create(FileEditorInput, data.files[i]);
            this.editorService.openEditor(input);
        }
    }

    private onSaveFile(input: IEditorInput): void {
        input.save();
    }
}