import { IEditorInput } from '../../../platform/editor/editor';

export abstract class EditorInput implements IEditorInput {
    constructor() {

    }

    public getId(): string {
        return null;
    }

    public getName(): string {
        return null;
    }

    public matches(other: any): boolean {
        return this === other;
    }

    public abstract resolve(): Promise<any>;

    public getPreferredEditorId(): string {
        return null;
    }
}