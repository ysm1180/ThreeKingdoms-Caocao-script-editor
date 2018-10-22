import { BaseEditor } from '../../editor/workbench/browser/parts/editor/baseEditor';

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

export interface IResource {
    path: string;

    type: string;
}

export interface IResourceInput {
    resource: string;

    label?: string;
}

export interface IUntitleResourceInput {
    resource?: string;

    label?: string;


}