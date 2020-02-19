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
  extensions?: IFileExtension[];
}

export interface ISavingFile {
  title: string;
  extensions?: IFileExtension[];
  name?: string;
}

export interface IFileExtension {
  name?: string;
  extensions: string; // split by semicolon
}

export function getFileFilters(...extensions: IFileExtension[]): FileFilter[] {
  const filters: FileFilter[] = [];

  for (let i = 0; i < extensions.length; i++) {
    const exs = extensions[i].extensions.split(';');

    if (!extensions[i].name) {
      const names = [];
      for (const ex of exs) {
        names.push(`${ex[0].toUpperCase()}${ex.slice(1)}`);
      }
      extensions[i].name = names.join(', ');
    }

    const displayExtension = exs.map((ex) => `*.${ex}`).join(', ');

    filters.push({
      name: `${extensions[i].name} 파일 (${displayExtension})`,
      extensions: exs,
    });
  }

  return filters;
}
