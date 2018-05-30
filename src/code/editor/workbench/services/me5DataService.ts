import { decorator } from 'code/platform/instantiation/instantiation';
import { ITreeService, TreeService } from 'code/platform/tree/treeService';
import { IEditableItemData, IParentItem } from 'code/platform/files/me5Data';
import { IConfirmation } from 'code/platform/dialogs/dialogs';
import { Me5Group, Me5Item } from 'code/editor/workbench/parts/files/me5Data';
import { IDialogService, DialogService } from 'code/editor/workbench/services/electron-browser/dialogService';
import { BinaryFile } from 'code/editor/common/file';
import { Me5DataController } from '../parts/me5ExplorerModel';
import { IInstantiationService, InstantiationService } from '../../../platform/instantiation/instantiationService';

export const IMe5DataService = decorator<Me5DataService>('me5DataService');

export class Me5DataService {
    constructor(
        @ITreeService private treeService: TreeService,
        @IDialogService private dialogService: DialogService,
        @IInstantiationService private instantiationService: InstantiationService,
    ) {

    }

    public doAppendImageItem() {
        const lastTree = this.treeService.LastFocusedTree;
        const element = <Me5Group>lastTree.getSelection()[0];

        if (!element) {
            return;
        }

        this.dialogService.openFile({
            title: '이미지 파일을 선택해주세요.',
            multi: true,
            extensions: ['png'],
        }).then((req) => {
            if (!req.files) {
                return [];
            }

            const promises = [];
            for (let path of req.files) {
                const file = new BinaryFile(path);
                const promise = file.open();
                promises.push(promise);
            }

            return Promise.all(promises);
        }).then((values: Buffer[]) => {
            const selectItems = [];
            for (const value of values) {
                if (value) {
                    const item = new Me5Item();
                    const data = new Uint8Array(value.slice(0));
                    item.build(element, null, 'NEW IMAGE', data);

                    selectItems.push(item);
                }
            }

            lastTree.refresh(element).then(() => {
                return lastTree.expand(element);
            }).then(() => {
                lastTree.setSelection(selectItems);

                const controller: Me5DataController = this.instantiationService.create(Me5DataController);
                controller.onClick(lastTree, selectItems[0]);
            });
        });
    }

    public doInsertGroup() {
        const lastTree = this.treeService.LastFocusedTree;
        const element = <IEditableItemData>lastTree.getSelection()[0];
        const parent = element.getParent();

        const newGroup = new Me5Group();
        newGroup.build(parent, element);

        lastTree.refresh(parent);
    }

    public doRename() {
        const lastTree = this.treeService.LastFocusedTree;
        const element = <IEditableItemData>lastTree.getSelection()[0];

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
        const elements = <IEditableItemData[]>lastTree.getSelection();

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
                    lastTree.refresh(parent).then(() => {
                    });
                });
            }
        });
    }
}