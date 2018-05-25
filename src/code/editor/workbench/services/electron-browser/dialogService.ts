import { IWindowClientService, WindowClientService } from 'code/platform/windows/windowsIpc';
import { IConfirmation, IConfirmationResult } from 'code/platform/dialog/dialogs';
import { decorator } from 'code/platform/instantiation/instantiation';

export const IDialogService = decorator<DialogService>('dialogService');


export class DialogService {
    constructor(
        @IWindowClientService private windowService: WindowClientService,
    ) {

    }

    public confirm(confirmation: IConfirmation): Promise<IConfirmationResult> {
        const options = this.getConfirmationOptions(confirmation);

        return this.windowService.showMessageBox(options).then(({ button, checkboxChecked }) => {
            return {
                confirmed: button === 0,
                checkboxChecked
            };
        });
    }

    private getConfirmationOptions(confirmation: IConfirmation): Electron.MessageBoxOptions {
        const buttons: string[] = [];
        if (confirmation.primaryButton) {
            buttons.push(confirmation.primaryButton);
        } else {
            buttons.push('확인');
        }

        if (confirmation.secondaryButton) {
            buttons.push(confirmation.secondaryButton);
        } else if (typeof confirmation.secondaryButton === 'undefined') {
            buttons.push('취소');
        }

        const options: Electron.MessageBoxOptions = {
            title: confirmation.title,
            message: confirmation.message,
            buttons,
            cancelId: 1
        };

        if (confirmation.detail) {
            options.detail = confirmation.detail;
        }

        if (confirmation.type) {
            options.type = confirmation.type;
        }

        if (confirmation.checkbox) {
            options.checkboxLabel = confirmation.checkbox.label;
            options.checkboxChecked = confirmation.checkbox.checked;
        }

        return options;
    }
}