import { DomBuilder } from 'jojo/base/browser/domBuilder';
import { Disposable } from 'jojo/base/common/lifecycle';
import { IDimension } from 'jojo/editor/common/editorCommon';
import { IEditorInput } from 'jojo/platform/editor/common/editor';

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

  public create(parent: DomBuilder): void {
    this.parent = parent;
  }

  public getContainer(): DomBuilder {
    return this.parent;
  }

  public setInput(input: IEditorInput, refresh?: boolean): Promise<void> {
    this._input = input;

    return Promise.resolve();
  }

  public abstract layout(dimension?: IDimension): void;

  public dispose(): void {
    this.parent = null;
    this._input = null;

    super.dispose();
  }
}
