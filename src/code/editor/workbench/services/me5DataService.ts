import { BinaryFile } from 'code/platform/files/file';
import { decorator } from 'code/platform/instantiation/instantiation';
import { IConfirmation } from 'code/platform/dialogs/dialogs';
import { ITreeService, TreeService } from 'code/platform/tree/treeService';
import { IEditableItem, BaseMe5Item } from 'code/platform/files/me5Data';
import { Me5Group, Me5Item } from 'code/editor/workbench/parts/files/me5Data';
import { Me5DataController } from 'code/editor/workbench/parts/me5ExplorerModel';
import { IDialogService, DialogService } from 'code/editor/workbench/services/electron-browser/dialogService';
import { IInstantiationService, InstantiationService } from 'code/platform/instantiation/instantiationService';

export const IMe5DataService = decorator<Me5DataService>('me5DataService');

export class Me5DataService {
    constructor(
        @ITreeService private treeService: TreeService,
        @IDialogService private dialogService: DialogService,
        @IInstantiationService private instantiationService: InstantiationService,
    ) {

    }

    public doChangeItem() {
        const lastTree = this.treeService.LastFocusedTree;
        const element = <Me5Item>lastTree.getSelection()[0];

        if (!element) {
            return;
        }

        const parent = element.getParent() as Me5Group;

        this.dialogService.openFile({
            title: '파일을 선택해주세요.',
            extensions: [
                {name: 'ME5 아이템', extensions: 'png;jpg;bmp;mp3;wav'},
                { name: '이미지', extensions: 'png;jpg;bmp' },
                { name: '음악', extensions: 'mp3;wav' },
            ],
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
            for (const value of values) {
                if (value) {
                    const data = new Uint8Array(value.slice(0));
                    element.setData(data);
                }
            }

            lastTree.refresh(element).then(() => {
                return lastTree.expand(parent);
            }).then(() => {
                const controller: Me5DataController = this.instantiationService.create(Me5DataController);
                controller.onClick(lastTree, element);
            });
        });
    }

    public doInsertItem(isSelectionAfter?: boolean) {
        const lastTree = this.treeService.LastFocusedTree;
        let element = <BaseMe5Item>lastTree.getSelection()[0];
        let parent: IEditableItem;

        if (!element) {
            return;
        }

        if (!element.isGroup) {
            parent = element.getParent();
        } else {
            parent = element;
        }

        this.dialogService.openFile({
            title: '추가할 파일을 선택해주세요.',
            multi: true,
            extensions: [
                {name: 'ME5 아이템', extensions: 'png;jpg;bmp;mp3;wav'},
                { name: '이미지', extensions: 'png;jpg;bmp' },
                { name: '음악', extensions: 'mp3;wav' },
            ],
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
                    if (isSelectionAfter) {
                        item.build(<Me5Group>parent, element, 'NEW ITEM', data);
                    } else {
                        item.build(<Me5Group>parent, null, 'NEW ITEM', data);                        
                    }

                    selectItems.push(item);
                }
            }

            lastTree.refresh(parent).then(() => {
                return lastTree.expand(parent);
            }).then(() => {
                lastTree.setSelection(selectItems);

                const controller: Me5DataController = this.instantiationService.create(Me5DataController);
                controller.onClick(lastTree, selectItems[0]);
            });
        });
    }

    public doInsertGroup() {
        const lastTree = this.treeService.LastFocusedTree;
        const element = lastTree.getSelection()[0];

        let parent;
        let itemAfter;
        if (element instanceof Me5Group) {
            parent = element.getParent();
            itemAfter = element;
        } else {
            parent = element;
            itemAfter = null;
        }

        const newGroup = new Me5Group();
        newGroup.build(parent, itemAfter);

        lastTree.refresh(parent);
    }

    public doRename() {
        const lastTree = this.treeService.LastFocusedTree;
        const element = <IEditableItem>lastTree.getSelection()[0];

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
        const elements = <IEditableItem[]>lastTree.getSelection();

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