import { decorator } from 'jojo/platform/instantiation/common/instantiation';

export const IWindowService = decorator<IWindowService>('windowService');

export interface IWindowService {
  showOpenDialog(options: Electron.OpenDialogOptions): Promise<IOpenFileRequest>;

  showMessageBox(options: Electron.MessageBoxOptions): Promise<IMessageBoxResult>;

  showSaveDialog(options: Electron.SaveDialogOptions): Promise<ISaveFileRequest>;
}

export interface IOpenFileRequest {
  files: string[];
}

export interface ISaveFileRequest {
  file: string;
}

export interface OpenDialogOptions {
  title?: string;
  defaultPath?: string;
  buttonLabel?: string;
  filters?: FileFilter[];
  properties?: Array<
    | 'openFile'
    | 'openDirectory'
    | 'multiSelections'
    | 'showHiddenFiles'
    | 'createDirectory'
    | 'promptToCreate'
    | 'noResolveAliases'
    | 'treatPackageAsDirectory'
  >;
  message?: string;
}

export interface FileFilter {
  extensions: string[];
  name: string;
}

export interface MessageBoxOptions {
  type?: string;
  buttons?: string[];
  defaultId?: number;
  title?: string;
  message: string;
  detail?: string;
  checkboxLabel?: string;
  checkboxChecked?: boolean;
  cancelId?: number;
  noLink?: boolean;
  normalizeAccessKeys?: boolean;
}

export interface IMessageBoxResult {
  button: number;
  checkboxChecked?: boolean;
}

export interface SaveDialogOptions {
  title?: string;
  defaultPath?: string;
  buttonLabel?: string;
  filters?: FileFilter[];
  message?: string;
  nameFieldLabel?: string;
  showsTagField?: boolean;
}
