import { IOpenFileRequest, IMessageBoxResult, ISaveFileRequest } from '../windows';
import { decorator } from '../../instantiation/instantiation';
import { IWindowCreationOption, CodeWindow } from '../../../electron-main/window';
import { Event } from '../../../base/common/event';

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