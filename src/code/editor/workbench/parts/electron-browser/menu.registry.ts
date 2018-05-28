import { MenuRegistry, MenuId } from 'code/platform/actions/registry';
import { ServicesAccessor } from 'code/platform/instantiation/instantiation';
import { IMe5DataService } from 'code/editor/workbench/services/me5DataService';
import { KeybindingsRegistry } from '../../../../platform/keybindings/keybindingsRegistry';
import { KeyCode } from 'code/base/common/keyCodes';
import { ExplorerGroupContext } from '../files/me5Data';

const insertGroup = 'INSERT_GROUP';
const renameId = 'RENAME_COMMAND';
const deleteItemId = 'DELETE_COMMAND';

KeybindingsRegistry.registerKeybindingRule({
    id: renameId,
    primary: KeyCode.F2,
    handler: (accessor: ServicesAccessor) => {
        const me5DataService = accessor.get(IMe5DataService);
        me5DataService.doRename();
    },
});

KeybindingsRegistry.registerKeybindingRule({
    id: deleteItemId,
    primary: KeyCode.Delete,
    handler: (accessor: ServicesAccessor) => {
        const me5DataService = accessor.get(IMe5DataService);
        me5DataService.doDelete();
    },
});

MenuRegistry.appendMenuItem(MenuId.Me5ExplorerTreeContext, {
    group: 'insert',
    label: '새 그룹',
    command: {
        id: insertGroup,
        handler: (accessor: ServicesAccessor) => {
            const me5DataService = accessor.get(IMe5DataService);
            me5DataService.doInsertGroup();
        },
    },
    order: 1,
    when: ExplorerGroupContext,
});

MenuRegistry.appendMenuItem(MenuId.Me5ExplorerTreeContext, {
    group: 'modification',
    label: '이름 바꾸기',
    command: {
        id: renameId,
    },
    order: 1,
});

MenuRegistry.appendMenuItem(MenuId.Me5ExplorerTreeContext, {
    group: 'modification',
    label: '삭제',
    command: {
        id: deleteItemId,
    },
    order: 2,
});