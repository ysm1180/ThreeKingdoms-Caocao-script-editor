import { MenuRegistry, MenuId } from 'code/platform/actions/registry';
import { ServicesAccessor } from 'code/platform/instantiation/instantiation';
import { IMe5DataService } from 'code/editor/workbench/services/me5DataService';
import { KeybindingsRegistry } from 'code/platform/keybindings/keybindingsRegistry';
import { KeyCode, KeyMode } from 'code/base/common/keyCodes';
import { explorerRootContext, explorerGroupContext } from 'code/editor/workbench/browser/parts/me5Explorer';
import { ContextKeyExpr } from 'code/platform/contexts/contextKey';
import { explorerEditContext } from 'code/editor/workbench/parts/me5ExplorerModel';

const INSERT_GROUP_ID = 'INSERT_GROUP';
const MODIFICATION_ID = 'MODIFICATION';
const APPEND_IMAGE_ID = 'APPEND_IMAGE';
const RENAME_ID = 'RENAME_COMMAND';
const DELETE_ID = 'DELETE_COMMAND';
const COPY_TEXT_ID = 'COPY_TEXT';

KeybindingsRegistry.registerKeybindingRule({
    id: RENAME_ID,
    primary: KeyCode.F2,
    handler: (accessor: ServicesAccessor) => {
        const me5DataService = accessor.get(IMe5DataService);
        me5DataService.doRename();
    },
    when: ContextKeyExpr.and(explorerRootContext.not(), explorerEditContext.not()),
});

KeybindingsRegistry.registerKeybindingRule({
    id: DELETE_ID,
    primary: KeyCode.Delete,
    handler: (accessor: ServicesAccessor) => {
        const me5DataService = accessor.get(IMe5DataService);
        me5DataService.doDelete();
    },
    when: ContextKeyExpr.and(explorerRootContext.not(), explorerEditContext.not()),
});

KeybindingsRegistry.registerKeybindingRule({
    id: MODIFICATION_ID,
    primary: KeyMode.Ctrl | KeyCode.KEY_E,
    handler: (accessor: ServicesAccessor) => {

    },
    when: ContextKeyExpr.and(ContextKeyExpr.not(ContextKeyExpr.or(explorerGroupContext, explorerRootContext)), explorerEditContext.not()),
});

MenuRegistry.appendMenuItem(MenuId.Me5ExplorerTreeContext, {
    group: 'insert',
    label: '새 그룹',
    command: {
        id: INSERT_GROUP_ID,
        handler: (accessor: ServicesAccessor) => {
            const me5DataService = accessor.get(IMe5DataService);
            me5DataService.doInsertGroup();
        },
    },
    order: 1,
    when: ContextKeyExpr.and(ContextKeyExpr.or(explorerGroupContext, explorerRootContext), explorerEditContext.not()),
});

MenuRegistry.appendMenuItem(MenuId.Me5ExplorerTreeContext, {
    group: 'insert',
    label: '새 이미지',
    command: {
        id: APPEND_IMAGE_ID,
        handler: (accessor: ServicesAccessor) => {
            const me5DataService = accessor.get(IMe5DataService);
            me5DataService.doAppendImageItem();
        },
    },
    order: 2,
    when: ContextKeyExpr.and(explorerGroupContext, explorerEditContext.not()),
});

MenuRegistry.appendMenuItem(MenuId.Me5ExplorerTreeContext, {
    group: 'modification',
    label: '수정',
    command: {
        id: MODIFICATION_ID,
    },
    order: 1,
    when: ContextKeyExpr.and(ContextKeyExpr.not(ContextKeyExpr.or(explorerGroupContext, explorerRootContext)), explorerEditContext.not()),
});

MenuRegistry.appendMenuItem(MenuId.Me5ExplorerTreeContext, {
    group: 'modification',
    label: '이름 바꾸기',
    command: {
        id: RENAME_ID,
    },
    order: 2,
    when: ContextKeyExpr.and(explorerRootContext.not(), explorerEditContext.not()),
});

MenuRegistry.appendMenuItem(MenuId.Me5ExplorerTreeContext, {
    group: 'modification',
    label: '삭제',
    command: {
        id: DELETE_ID,
    },
    order: 3,
    when: ContextKeyExpr.and(explorerRootContext.not(), explorerEditContext.not()),
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