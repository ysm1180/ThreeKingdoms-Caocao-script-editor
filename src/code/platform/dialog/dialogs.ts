export interface IConfirmation {
    title?: string;
    type?: 'none' | 'info' | 'error' | 'question' | 'warning';
    message: string;
    detail?: string;
    primaryButton?: string;
    secondaryButton?: string;
    checkbox?: {
        label: string;
        checked?: boolean;
    };
}


export interface IConfirmationResult {
    confirmed: boolean;
    checkboxChecked?: boolean;
}