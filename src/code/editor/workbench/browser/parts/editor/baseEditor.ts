import { DomBuilder } from 'code/base/browser/domBuilder';
import { IEditorInput } from 'code/platform/editor/editor';
import { Disposable } from 'code/base/common/lifecycle';

export abstract class BaseEditor extends Disposable {
    private parent: DomBuilder;

    private id: string;

    constructor(id: string) {
        super();

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

    public abstract setInput(input: IEditorInput): Promise<void>;

    public dispose() {
        this.parent = null;

        super.dispose();
    }
}