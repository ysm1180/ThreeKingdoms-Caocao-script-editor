import './parts/files/fileCommands';
import './parts/electron-browser/menu.registry';
import './parts/electron-browser/sidebar.registry';
import './parts/electron-browser/statusbar.registry';
import './parts/electron-browser/file.registry';

import { WorkbenchShell } from './b/shell';


export function startup() {
    const shell = new WorkbenchShell(document.body);
    shell.open();
}