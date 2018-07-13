import { DomBuilder } from '../../../../../base/browser/domBuilder';
import { IEditorInput } from '../../../../../platform/editor/editor';
import { Disposable } from '../../../../../base/common/lifecycle';

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

    public abstract setInput(input: IEditorInput): Promise<any>;

    public dispose() {
        this.parent = null;

        super.dispose();
    }
}