import { decorator } from 'code/platform/instantiation/instantiation';
import { ITreeService, TreeService } from 'code/platform/tree/treeService';
import { IMe5Data } from 'code/platform/files/me5Data';
import { IDialogService, DialogService } from 'code/editor/workbench/services/electron-browser/dialogService';
import { IConfirmation } from '../../../platform/dialog/dialogs';

export const IMe5DataService = decorator<Me5DataService>('me5DataService');

export class Me5DataService {
    constructor(
        @ITreeService private treeService: TreeService,
        @IDialogService private dialogService: DialogService,
    ) {

    }

    public doRename() {
        const lastTree = this.treeService.LastFocusedTree;
        const element = <IMe5Data>lastTree.getSelection()[0];

        if (!element) {
            return;
        }

        element.setEditable(true);
        lastTree.refresh(element, true).then(() => {
            lastTree.setHighlight(element);
        });
    }

    public doDelete() {
        const lastTree = this.treeService.LastFocusedTree;
        const elements = <IMe5Data[]>lastTree.getSelection();

        const confirmation: IConfirmation = {
            title: 'ME5 항목 삭제',
            message: '해당 항목을 삭제하시겠습니까?',
            type: 'question',
        };

        this.dialogService.confirm(confirmation).then(result => {
            if (result.confirmed) {
                elements.forEach(element => {
                    const parent = element.getParent();
                    element.dispose();
                    lastTree.refresh(parent);            
                });
            }
        });
    }
}