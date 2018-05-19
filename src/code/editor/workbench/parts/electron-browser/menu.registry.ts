import { MenuRegistry, MenuId } from 'code/platform/actions/registry';

MenuRegistry.appendMenuItem(MenuId.Me5ExplorerContext, {
    group: 'modification',
    label: '이름 바꾸기',
    command: () => {
        
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