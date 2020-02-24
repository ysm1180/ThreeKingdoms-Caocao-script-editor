import { Event } from 'jojo/base/common/event';
import { CodeWindow, IWindowCreationOption } from 'jojo/code/electron-main/window';
import { decorator } from 'jojo/platform/instantiation/common/instantiation';
import { IMessageBoxResult, IOpenFileRequest, ISaveFileRequest } from 'jojo/platform/windows/common/windows';

export const IWindowMainService = decorator<IWindowMainService>('windowMainService');

export interface IWindowMainService {
  onWindowReady: Event<CodeWindow>;

  showOpenDialog(options: Electron.OpenDialogOptions): Promise<IOpenFileRequest>;
  showMessageBox(options: Electron.MessageBoxOptions): Promise<IMessageBoxResult>;
  showSaveDialog(options: Electron.SaveDialogOptions): Promise<ISaveFileRequest>;
  openNewWindow(options: IWindowCreationOption): void;
  openWorkingFiles(): void;
  quit(): void;
}
