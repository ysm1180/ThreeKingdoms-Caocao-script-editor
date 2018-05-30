'use strict';

import { Menu, MenuItem } from 'electron';
import { WindowManager, IWindowService } from 'code/electron-main/windows';
import * as arrays from 'code/base/common/array';

export const __separator__ = function (): MenuItem {
    return new MenuItem({ type: 'separator' });
};

export class AppMenu {
    constructor(
        @IWindowService private windowMainService: WindowManager
    ) {
        this.install();
    }

    private install() {
        const menubar = new Menu();

        const fileMenu = new Menu();
        const fileMenuItem = new MenuItem({ label: '파일(&F)', submenu: fileMenu });
        this.setFileMenuItem(fileMenu);

        const editMenu = new Menu();
        const editMenuItem = new MenuItem({ label: '편집(&E)', submenu: editMenu });
        this.setEditMenuItem(editMenu);

        const toolMenu = new Menu();
        const toolMenuItem = new MenuItem({ label: '도구(&T)', submenu: toolMenu });
        this.setToolMenuItem(toolMenu);

        arrays.coalesce([
            fileMenuItem,
            editMenuItem,
            toolMenuItem,
        ]).forEach(menuItem => menubar.append(menuItem));

        Menu.setApplicationMenu(menubar);
    }

    private setFileMenuItem(fileMenu: Menu) {
        const newFile = new MenuItem({ label: '새 파일(&N)', click: () => { this.windowMainService.openNewFile(); }, accelerator: 'Control+N' });
        const openFile = new MenuItem({ label: '파일 열기(&O)', click: () => { this.windowMainService.openWorkingFiles(); }, accelerator: 'Control+O' });
        const saveFile = new MenuItem({ label: '저장 (&S)', click: () => { this.windowMainService.saveFile(); }, accelerator: 'Control+S' });
        const exit = new MenuItem({ label: '종료(&X)', click: null });

        arrays.coalesce([
            newFile,
            openFile,
            saveFile,
            __separator__(),
            exit,
        ]).forEach(menuItem => fileMenu.append(menuItem));
    }

    private setEditMenuItem(editMenu: Menu) {

        arrays.coalesce([
        ]).forEach(menuItem => editMenu.append(menuItem));
    }

    private setToolMenuItem(toolMenu: Menu) {
        const toggleDebug = new MenuItem({ label: '개발자 도구', role: 'toggledevtools' });

        arrays.coalesce([
            toggleDebug,
        ]).forEach(menuItem => toolMenu.append(menuItem));
    }
}