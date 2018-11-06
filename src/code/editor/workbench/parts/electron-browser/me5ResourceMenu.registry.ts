import { MenuRegistry, MenuId } from '../../../../platform/actions/registry';
import { ServicesAccessor } from '../../../../platform/instantiation/instantiation';
import { KeybindingsRegistry } from '../../../../platform/keybindings/keybindingsRegistry';
import { KeyCode, KeyMode } from '../../../../base/common/keyCodes';
import { me5ExplorerRootContext, me5ExplorerGroupContext, me5ExplorerItemContext } from '../../browser/parts/me5Explorer';
import { ContextKeyExpr } from '../../../../platform/contexts/contextKey';
import { explorerEditContext } from '../me5ExplorerViewer';
import { Me5Stat, ItemState } from '../files/me5Data';
import { DialogService, IDialogService } from '../../services/electron-browser/dialogService';
import { BinaryFile } from '../../../../platform/files/file';
import { WorkbenchEditorService, IWorkbenchEditorService } from '../../services/editor/editorService';
import { TreeService, ITreeService } from '../../../../platform/tree/treeService';
import { ResourceFileService } from '../../services/resourceFile/resourceFileService';
import { IInstantiationService } from '../../../../platform/instantiation/instantiationService';
import { IConfirmation } from '../../../../platform/dialogs/dialogs';
import { ImageType, ImageResource } from '../../common/imageResource';
import { IResourceFileService } from '../../services/resourceFile/resourcefiles';

const INSERT_GROUP_ID = 'INSERT_GROUP';
const MODIFICATION_ID = 'MODIFICATION';
const INSERT_ITEM_ID = 'INSERT_ITEM';
const RENAME_ID = 'RENAME_COMMAND';
const DELETE_ID = 'DELETE_COMMAND';
const EXPORT_ITEM = 'EXPORT_ITEM';

function resolveImageData(file: BinaryFile): Promise<Uint8Array> {
    return Promise.resolve().then(() => {
        return file.open().then(() => {
            return file.data;
        });
    });
}

function doChangeItem(
    resourceFileService: ResourceFileService,
    editorService: WorkbenchEditorService,
    dialogService: DialogService,
    treeService: TreeService
) {
    const lastTree = treeService.LastFocusedTree;
    const element = <Me5Stat>lastTree.getFocus();

    if (!element || element.isGroup) {
        return;
    }

    dialogService.openFile({
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
            const promise = resolveImageData(file);
            promises.push(promise);
        }

        return Promise.all(promises);
    }).then((imageData: Uint8Array[]) => {
        const activeInput = editorService.getActiveEditorInput();
        for (const imageDataArray of imageData) {
            const model = resourceFileService.models.get(activeInput.getResource());
            const index = model.resourceModel.add(Buffer.from(imageDataArray.buffer));
            element.index = index;
        }

        if (imageData.length > 0) {
            editorService.refresh();
        }
    });
}

function doInsertItem(
    resourceFileService: ResourceFileService,
    editorService: WorkbenchEditorService,
    dialogService: DialogService,
    treeService: TreeService,
    instantiationService: IInstantiationService,
    isSelectionAfter?: boolean
) {
    const lastTree = treeService.LastFocusedTree;
    let element = <Me5Stat>lastTree.getFocus();
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
    dialogService.openFile({
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
            const promise = resolveImageData(file);
            promises.push(promise);
        }

        return Promise.all(promises);
    }).then((binaries: Uint8Array[]) => {
        const selectItems = [];
        const activeInput = editorService.getActiveEditorInput();
        for (const [index, binary] of binaries.entries()) {
            const model = resourceFileService.models.get(activeInput.getResource());
            const bufferIndex = model.resourceModel.add(Buffer.from(binary.buffer));
            const item = instantiationService.create(Me5Stat, names[index], false, element.root, bufferIndex);
            item.build(parent, isSelectionAfter ? element : null);
            selectItems.push(item);
        }

        if (binaries.length > 0) {
            lastTree.refresh(parent).then(() => {
                return lastTree.expand(parent);
            }).then(() => {
                lastTree.setSelection(selectItems);
                editorService.refresh();
            });
        }
    });
}

function doInsertGroup(
    treeService: TreeService,
    instantiationService: IInstantiationService,
) {
    const lastTree = treeService.LastFocusedTree;
    const element = <Me5Stat>lastTree.getFocus();

    let root;
    let itemAfter;
    if (element === lastTree.getRoot()) {
        root = <Me5Stat>lastTree.getRoot();
        itemAfter = null;
    } else {
        root = element.parent;
        itemAfter = element;
    }

    const newGroup = instantiationService.create(Me5Stat, 'NEW GROUP', true, root, null);
    newGroup.build(root, itemAfter);

    lastTree.refresh(root);
}

function doRename(
    treeService: TreeService,
) {
    const lastTree = treeService.LastFocusedTree;
    const element = <Me5Stat>lastTree.getFocus();

    if (!element || element.isRoot) {
        return;
    }

    element.state = ItemState.Edit;
    lastTree.refresh(element, true).then(() => {
        lastTree.setHighlight(element);
    });
}

function doDelete(
    dialogService: DialogService,
    treeService: TreeService,
) {
    const lastTree = treeService.LastFocusedTree;
    const elements = [<Me5Stat>lastTree.getFocus()];

    if (elements.length > 0) {
        const confirmation: IConfirmation = {
            title: 'ME5 항목 삭제',
            message: '해당 항목을 삭제하시겠습니까?',
            type: 'question',
        };

        dialogService.confirm(confirmation).then(result => {
            if (result.confirmed) {
                elements.forEach(element => {
                    const parent = element.parent;
                    element.dispose();
                    lastTree.refresh(parent);
                });
            }
        });
    }
}

function doExportImage(
    dialogService: DialogService,
    treeService: TreeService,
) {
    const lastTree = treeService.LastFocusedTree;
    const element = <Me5Stat>lastTree.getFocus();

    dialogService.saveFile({
        title: '다른 이름으로 저장',
        extensions: [
            { name: '이미지', extensions: 'png;jpg' },
        ],
    }).then((req) => {
        if (!req || !req.file) {
            return null;
        }

        const buffer = element.data;
        const file = new BinaryFile(req.file);

        let convertPromise;
        if (file.ext === ImageType.Png) {
            convertPromise = ImageResource.convertToPng(buffer);
        } else {
            convertPromise = ImageResource.convertToJpeg(buffer);
        }

        return convertPromise.then((buffer: Buffer) => {
            file.write(0, buffer.length, buffer);
        });
    });
}

KeybindingsRegistry.registerKeybindingRule({
    id: RENAME_ID,
    primary: KeyCode.F2,
    handler: (accessor: ServicesAccessor) => {
        const treeService = accessor.get(ITreeService);
        doRename(treeService);
    },
    when: ContextKeyExpr.and(me5ExplorerRootContext.not(), explorerEditContext.not()),
});

KeybindingsRegistry.registerKeybindingRule({
    id: DELETE_ID,
    primary: KeyCode.Delete,
    handler: (accessor: ServicesAccessor) => {
        const dialogService = accessor.get(IDialogService);
        const treeService = accessor.get(ITreeService);
        doDelete(dialogService, treeService);
    },
    when: ContextKeyExpr.and(me5ExplorerRootContext.not(), explorerEditContext.not()),
});

KeybindingsRegistry.registerKeybindingRule({
    id: MODIFICATION_ID,
    primary: KeyMode.Ctrl | KeyCode.KEY_E,
    handler: (accessor: ServicesAccessor) => {
        const resourceFileService = accessor.get(IResourceFileService);
        const editorService = accessor.get(IWorkbenchEditorService);
        const dialogService = accessor.get(IDialogService);
        const treeService = accessor.get(ITreeService);
        doChangeItem(resourceFileService, editorService, dialogService, treeService);
    },
    when: ContextKeyExpr.and(me5ExplorerItemContext, explorerEditContext.not()),
});

MenuRegistry.appendMenuItem(MenuId.Me5ExplorerTreeContext, {
    group: 'insert',
    label: '새 그룹',
    command: {
        id: INSERT_GROUP_ID,
        handler: (accessor: ServicesAccessor) => {
            const treeService = accessor.get(ITreeService);
            const instantiationService = accessor.get(IInstantiationService);
            doInsertGroup(treeService, instantiationService);
        },
    },
    order: 1,
    when: ContextKeyExpr.and(ContextKeyExpr.not(me5ExplorerItemContext), explorerEditContext.not()),
});

MenuRegistry.appendMenuItem(MenuId.Me5ExplorerTreeContext, {
    group: 'insert',
    label: '새 아이템',
    command: {
        id: INSERT_ITEM_ID,
        handler: (accessor: ServicesAccessor) => {
            const resourceFileService = accessor.get(IResourceFileService);
            const editorService = accessor.get(IWorkbenchEditorService);
            const dialogService = accessor.get(IDialogService);
            const treeService = accessor.get(ITreeService);
            const instantiationService = accessor.get(IInstantiationService);
            doInsertItem(resourceFileService, editorService, dialogService, treeService, instantiationService);
        },
    },
    order: 2,
    when: ContextKeyExpr.and(me5ExplorerGroupContext, explorerEditContext.not()),
});

MenuRegistry.appendMenuItem(MenuId.Me5ExplorerTreeContext, {
    group: 'modification',
    label: '수정',
    command: {
        id: MODIFICATION_ID,
    },
    order: 1,
    when: ContextKeyExpr.and(me5ExplorerItemContext, explorerEditContext.not()),
});

MenuRegistry.appendMenuItem(MenuId.Me5ExplorerTreeContext, {
    group: 'modification',
    label: '이름 바꾸기',
    command: {
        id: RENAME_ID,
    },
    order: 2,
    when: ContextKeyExpr.and(me5ExplorerRootContext.not(), explorerEditContext.not()),
});

MenuRegistry.appendMenuItem(MenuId.Me5ExplorerTreeContext, {
    group: 'modification',
    label: '삭제',
    command: {
        id: DELETE_ID,
    },
    order: 3,
    when: ContextKeyExpr.and(me5ExplorerRootContext.not(), explorerEditContext.not()),
});

MenuRegistry.appendMenuItem(MenuId.Me5ExplorerTreeContext, {
    group: 'item',
    label: '이미지 추출',
    command: {
        id: EXPORT_ITEM,
        handler: (accessor: ServicesAccessor) => {
            const dialogService = accessor.get(IDialogService);
            const treeService = accessor.get(ITreeService);
            doExportImage(dialogService, treeService);
        },
    },
    order: 1,
    when: ContextKeyExpr.and(me5ExplorerItemContext, explorerEditContext.not()),
});



// Edit Shortcut
KeybindingsRegistry.registerKeybindingRule({
    id: 'undo',
    primary: KeyMode.Ctrl | KeyCode.KEY_Z,
    handler: undefined,
    when: explorerEditContext,
});

KeybindingsRegistry.registerKeybindingRule({
    id: 'redo',
    primary: KeyMode.Ctrl | KeyCode.KEY_Y,
    handler: undefined,
    when: explorerEditContext,
});

KeybindingsRegistry.registerKeybindingRule({
    id: 'cut',
    primary: KeyMode.Ctrl | KeyCode.KEY_X,
    handler: undefined,
    when: explorerEditContext,
});

KeybindingsRegistry.registerKeybindingRule({
    id: 'copy',
    primary: KeyMode.Ctrl | KeyCode.KEY_C,
    handler: undefined,
    when: explorerEditContext,
});

KeybindingsRegistry.registerKeybindingRule({
    id: 'paste',
    primary: KeyMode.Ctrl | KeyCode.KEY_V,
    handler: undefined,
    when: explorerEditContext,
});

KeybindingsRegistry.registerKeybindingRule({
    id: 'selectall',
    primary: KeyMode.Ctrl | KeyCode.KEY_A,
    handler: undefined,
    when: explorerEditContext,
});

MenuRegistry.appendMenuItem(MenuId.Me5ExplorerTreeContext, {
    group: '1_undoredo',
    label: '실행 취소',
    command: {
        id: 'undo',
        role: true,
    },
    order: 1,
    when: explorerEditContext,
});

MenuRegistry.appendMenuItem(MenuId.Me5ExplorerTreeContext, {
    group: '1_undoredo',
    label: '다시 실행',
    command: {
        id: 'redo',
        role: true,
    },
    order: 2,
    when: explorerEditContext,
});

MenuRegistry.appendMenuItem(MenuId.Me5ExplorerTreeContext, {
    group: '2_cutcopypaste',
    label: '잘라내기',
    command: {
        id: 'cut',
        role: true,
    },
    order: 1,
    when: explorerEditContext,
});

MenuRegistry.appendMenuItem(MenuId.Me5ExplorerTreeContext, {
    group: '2_cutcopypaste',
    label: '복사',
    command: {
        id: 'copy',
        role: true,
    },
    order: 2,
    when: explorerEditContext,
});

MenuRegistry.appendMenuItem(MenuId.Me5ExplorerTreeContext, {
    group: '2_cutcopypaste',
    label: '붙여넣기',
    command: {
        id: 'paste',
        role: true,
    },
    order: 3,
    when: explorerEditContext,
});

MenuRegistry.appendMenuItem(MenuId.Me5ExplorerTreeContext, {
    group: '3_select_all',
    label: '모두 선택',
    command: {
        id: 'selectall',
        role: true,
    },
    order: 1,
    when: explorerEditContext,
});