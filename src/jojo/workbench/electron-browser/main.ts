import { WorkbenchShell } from 'jojo/workbench/electron-browser/shell';

export function startup() {
  const shell = new WorkbenchShell(document.body);
  shell.open();
}
