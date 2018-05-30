import { FileFilter } from 'electron';

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

export interface IOpenningFile {
    title: string;
    multi?: boolean;
    extensions?: string[];
}

export function getFileFilters(...extensions: string[]): FileFilter[] {
    const filters: FileFilter[] = [];

    for (let i = 0; i < extensions.length; i++) {
        let extensionName;
        if (extensions[i] === '*') {
            extensionName = '모든';            
        } else {
            extensionName = `${extensions[i][0].toUpperCase()}${extensions[i].slice(1)}`;
        }
        filters.push({
            name: `${extensionName} 파일 (*.${extensions[i]})`,
            extensions: [extensions[i]],
        });
    }

    return filters;
}