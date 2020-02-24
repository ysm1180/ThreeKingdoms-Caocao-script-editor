import { Event } from 'jojo/base/common/event';
import { IEditorInput } from 'jojo/platform/editor/common/editor';

export abstract class EditorInput implements IEditorInput {
  public onSaving = new Event<void>();
  public onSaved = new Event<void>();
  public onChangedState = new Event<void>();

  constructor() {}

  public getResource(): string {
    return null;
  }

  public getName(): string {
    return null;
  }

  public matches(other: any): boolean {
    return this === other;
  }

  public isSaving(): boolean {
    return false;
  }

  public isLoaded(): boolean {
    return true;
  }

  public abstract resolve(): Promise<any>;

  public getPreferredEditorId(): string {
    return null;
  }

  public dispose(): void {}
}
