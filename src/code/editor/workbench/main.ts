import 'code/editor/workbench/parts/electron-browser/menu.registry';
import 'code/editor/workbench/parts/electron-browser/sidebar.registry';
import 'code/editor/workbench/parts/electron-browser/statusbar.registry';

import { WorkbenchShell } from 'code/editor/workbench/browser/shell';


export function startup() {
    const shell = new WorkbenchShell(document.body);
    shell.open();
}