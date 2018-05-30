import { ipcRenderer } from 'electron';
import { IOpenFileRequest } from 'code/platform/windows/windows';
import { FileEditorInput } from 'code/editor/workbench/common/editor';
import { Me5File, ISaveMe5Data } from 'code/editor/common/file';
import { IEditorService, EditorPart } from 'code/editor/workbench/browser/parts/editor/editorPart';
import { IEditorInput } from 'code/platform/editor/editor';
import { ITreeService, TreeService } from 'code/platform/tree/treeService';
import { IDialogService, DialogService } from 'code/editor/workbench/services/electron-browser/dialogService';
import { ISavingFile } from 'code/platform/dialogs/dialogs';
import { Me5Stat } from 'code/editor/workbench/parts/files/me5Data';

export class ElectronWindow {
    constructor(
        @IEditorService private editorService: EditorPart,
        @ITreeService private treeService: TreeService,
        @IDialogService private dialogService: DialogService,
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
            const input = new FileEditorInput(data.files[i], data.new);
            this.editorService.openEditor(input);
        }
    }

    private onSaveFile(input: IEditorInput): void {
        const stat = this.treeService.LastFocusedTree.getRoot();

        input.resolve().then((isNew) => {
            let done: Promise<Me5Stat>;
            if (isNew) {
                const saving: ISavingFile = {
                    title: '다른 이름으로 저장',
                    name: input.getId(),
                    extensions: [{
                        extensions: 'me5',
                    }]
                };

                done = this.dialogService.save(saving).then((data) => {
                    if (!data.file) {
                        return null;
                    }

                    const newStat = new Me5Stat(data.file);
                    const groups = stat.getChildren();
                    for (const group of groups) {
                        group.build(newStat, null, group.getName());
                    }

                    return newStat;
                });
            } else {
                done = Promise.resolve(stat);
            }

            done.then((stat) => {
                if (!stat) {
                    return;
                }

                const options: ISaveMe5Data = {
                    stat
                };

                const file = new Me5File(stat.getId());
                file.save(options);
            });
        });
    }
}