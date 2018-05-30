import { ipcRenderer } from 'electron';
import { IOpenFileRequest } from 'code/platform/windows/windows';
import { FileEditorInput } from 'code/editor/workbench/common/editor';
import { IEditorService, EditorPart } from 'code/editor/workbench/browser/parts/editor/editorPart';
import { Me5File, ISaveMe5Data } from '../common/file';
import { ITreeService, TreeService } from 'code/platform/tree/treeService';

export class ElectronWindow {
    constructor(
        @IEditorService private editorService: EditorPart,
        @ITreeService private treeService: TreeService,
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
            
            this.onSaveFile(input.getId());
        });
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

    private onSaveFile(path: string): void {
        const file = new Me5File(path);

        const options: ISaveMe5Data = {
            stat: this.treeService.LastFocusedTree.getRoot(),
        };

        file.save(options);
    }
}