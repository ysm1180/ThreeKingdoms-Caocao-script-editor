import { DomBuilder } from '../../../../../base/browser/domBuilder';
import { IEditorInput } from '../../../../../platform/editor/editor';
import { Disposable } from '../../../../../base/common/lifecycle';
import { IDimension } from '../../../../common/editorCommon';

export abstract class BaseEditor extends Disposable {
    private parent: DomBuilder;
    private input: IEditorInput;
    private id: string;

    constructor(id: string) {
        super();

        this.parent = null;
        this.id = id;
        this.input = null;
    }

    public getInput(): IEditorInput {
        return this.input;
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

    public setInput(input: IEditorInput): Promise<void> {
        this.input = input;

        return Promise.resolve();
    }

    public abstract layout(dimension?: IDimension): void;

    public dispose() {
        this.parent = null;
        this.input = null;

        super.dispose();
    }
}