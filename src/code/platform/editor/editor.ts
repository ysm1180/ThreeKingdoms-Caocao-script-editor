import { BaseEditor } from '../../editor/workbench/browser/parts/editor/baseEditor';

export interface IEditorEvent {
    editor: IEditorInput;
}

export interface IEditorDescriptor {
    getCompositeId(): string;

    getEditorId(): string;

    create(): BaseEditor;
}

export interface IEditorInput {
    getId(): any;

    getName(): string;

    matches(other: any): boolean;

    resolve(): Promise<any>;

    getPreferredEditorId(): string;
}
