import '../parts/files/fileCommands';
import '../browser/parts/editor/editor.registry';
import '../parts/me5/electron-browser/views/me5ExplorerMenu.registry';

import { WorkbenchShell } from './shell';

export function startup() {
  const shell = new WorkbenchShell(document.body);
  shell.open();
}
