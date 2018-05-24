import { MenuRegistry, MenuId } from 'code/platform/actions/registry';
import { ServicesAccessor } from 'code/platform/instantiation/instantiation';
import { IMe5DataService } from 'code/editor/workbench/services/me5DataService';
import { ITreeService } from 'code/platform/tree/treeService';

MenuRegistry.appendMenuItem(MenuId.Me5ExplorerContext, {
    group: 'modification',
    label: '이름 바꾸기',
    command: (accessor: ServicesAccessor) => {
        const me5DataService = accessor.get(IMe5DataService);
        me5DataService.doRename();

    },
    order: 1,
    shortcutKey: 'F2',
});

MenuRegistry.appendMenuItem(MenuId.Me5ExplorerContext, {
    group: 'modification',
    label: '삭제',
    command: () => {
        
    },
    order: 2,
    shortcutKey: 'Delete',
});