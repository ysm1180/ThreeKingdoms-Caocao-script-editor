import { DomBuilder } from '../../../../../base/browser/domBuilder';
import { Disposable } from '../../../../../base/common/lifecycle';
import { IEditorInput } from '../../../../../platform/editor/editor';
import { IDimension } from '../../../../common/editorCommon';

export abstract class BaseEditor extends Disposable {
    private parent: DomBuilder;
    private _input: IEditorInput;
    private id: string;

    constructor(id: string) {
        super();

        this.parent = null;
        this.id = id;
        this._input = null;
    }

    public get input(): IEditorInput {
        return this._input;
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

    public setInput(input: IEditorInput, refresh?: boolean): Promise<void> {
        this._input = input;

        return Promise.resolve();
    }

    public abstract layout(dimension?: IDimension): void;

    public dispose() {
        this.parent = null;
        this._input = null;

        super.dispose();
    }
}
