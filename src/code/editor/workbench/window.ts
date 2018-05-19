import { ipcRenderer } from 'electron';
import { IOpenFileRequest } from 'code/platform/windows/windows';
import { FileEditorInput } from 'code/editor/workbench/common/editor';
import { IEditorService, EditorPart } from 'code/editor/workbench/browser/parts/editor/editorPart';

export class ElectronWindow {
    constructor(
        @IEditorService private editorService: EditorPart
    ) {
        this.registerListeners();
    }

    public registerListeners() {
        ipcRenderer.on('editor:openFiles', (e, data: IOpenFileRequest) => this.onOpenFiles(data));
    }

    private onOpenFiles(data: IOpenFileRequest): void {
        if (!data.files) {
            return;
        }

        for (let i = 0; i < data.files.length; i++) {
            const input = new FileEditorInput(data.files[i]);
            this.editorService.openEditor(input);
        }
    }
}