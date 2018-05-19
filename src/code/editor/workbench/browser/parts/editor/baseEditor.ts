import { DomBuilder } from 'code/base/browser/domBuilder';
import { IEditorInput } from 'code/platform/editor/editor';

export class BaseEditor {
    private parent: DomBuilder;

    private id: string;

    constructor(id: string) {
        this.parent = null;
        this.id = id;
    }

    public getId(): string {
        return this.id;
    }

    public create(parent: DomBuilder) {
        this.parent = parent;
    }

    public getContainer() {
        return this.parent;
    }

    public setInput(input: IEditorInput) {
    }
}