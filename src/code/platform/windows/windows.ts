export interface IOpenFileRequest {
    files: string[];
}

export interface ISaveFileRequest {
    file: string;
    created?: boolean;
}

export interface OpenDialogOptions {
    title?: string;
    defaultPath?: string;
    buttonLabel?: string;
    filters?: FileFilter[];
    properties?: Array<'openFile' | 'openDirectory' | 'multiSelections' | 'showHiddenFiles' | 'createDirectory' | 'promptToCreate' | 'noResolveAliases' | 'treatPackageAsDirectory'>;
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