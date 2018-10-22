import * as sharp from 'sharp';
import * as bmp from 'bmp-js';
import { BinaryFile } from '../../../../platform/files/file';
import { decorator, ServiceIdentifier } from '../../../../platform/instantiation/instantiation';
import { IConfirmation } from '../../../../platform/dialogs/dialogs';
import { ITreeService, TreeService } from '../../../../platform/tree/treeService';
import { Me5Stat, ItemState } from '../../parts/files/me5Data';
import { Me5DataController } from '../../parts/me5ExplorerViewer';
import { IDialogService, DialogService } from '../electron-browser/dialogService';
import { IInstantiationService } from '../../../../platform/instantiation/instantiationService';
import { ImageType, ImageResource } from '../../common/imageResource';

export const IMe5DataService: ServiceIdentifier<Me5DataService> = decorator<Me5DataService>('me5DataService');

export class Me5DataService {
    constructor(
        @ITreeService private treeService: TreeService,
        @IDialogService private dialogService: DialogService,
        @IInstantiationService private instantiationService: IInstantiationService,
    ) {

    }

    private _resolveImageData(file: BinaryFile): Promise<Uint8Array> {
        return Promise.resolve().then(() => {
            return file.open().then(() => {
                return ImageResource.convertToJpeg(file.data);
            });
        });
    }

    public doChangeItem() {
        const lastTree = this.treeService.LastFocusedTree;
        const element = <Me5Stat>lastTree.getSelection()[0];

        if (!element || element.isGroup) {
            return;
        }

        const parent = element.parent;

        this.dialogService.openFile({
            title: '파일을 선택해주세요.',
            extensions: [
                { name: 'ME5 아이템', extensions: 'png;jpg;bmp;mp3;wav' },
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
                const promise = this._resolveImageData(file);
                promises.push(promise);
            }

            return Promise.all(promises);
        }).then((imageData) => {
            for (const imageDataArray of imageData) {
                const data = new Uint8Array(imageDataArray.slice(0));
                element.data = data;
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
        let element = <Me5Stat>lastTree.getSelection()[0];
        let parent: Me5Stat;

        if (!element) {
            return;
        }

        if (!element.isGroup) {
            parent = element.parent;
        } else {
            parent = element;
        }

        let names = [];
        this.dialogService.openFile({
            title: '추가할 파일을 선택해주세요.',
            multi: true,
            extensions: [
                { name: 'ME5 아이템', extensions: 'png;jpg;bmp;mp3;wav' },
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
                names.push(file.name);
                const promise = this._resolveImageData(file);
                promises.push(promise);
            }

            return Promise.all(promises);
        }).then((binaries: Uint8Array[]) => {
            const selectItems = [];
            for (const [index, binary] of binaries.entries()) {
                const data = new Uint8Array(binary.slice(0));
                const item = new Me5Stat(element.root.getId(), false, element.root, names[index], data);
                item.build(parent, isSelectionAfter ? element : null);
                selectItems.push(item);
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
        const element = <Me5Stat>lastTree.getSelection()[0];

        let root;
        let itemAfter;
        if (element.isRoot) {
            root = element;
            itemAfter = null;
        } else {
            root = element.parent;
            itemAfter = element;
        }

        const newGroup = new Me5Stat(root.getId(), true, root, 'NEW GROUP');
        newGroup.build(root, itemAfter);

        lastTree.refresh(root);
    }

    public doRename() {
        const lastTree = this.treeService.LastFocusedTree;
        const element = <Me5Stat>lastTree.getSelection()[0];

        if (!element || element.isRoot) {
            return;
        }

        element.state = ItemState.Edit;
        lastTree.refresh(element, true).then(() => {
            lastTree.setHighlight(element);
        });
    }

    public doDelete() {
        const lastTree = this.treeService.LastFocusedTree;
        const elements = <Me5Stat[]>lastTree.getSelection();

        const confirmation: IConfirmation = {
            title: 'ME5 항목 삭제',
            message: '해당 항목을 삭제하시겠습니까?',
            type: 'question',
        };

        this.dialogService.confirm(confirmation).then(result => {
            if (result.confirmed) {
                elements.forEach(element => {
                    const parent = element.parent;
                    element.dispose();
                    lastTree.refresh(parent).then(() => {
                    });
                });
            }
        });
    }
}