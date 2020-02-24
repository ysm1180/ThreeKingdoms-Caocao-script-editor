import { Event } from 'jojo/base/common/event';
import { IEditorInput } from 'jojo/platform/editor/common/editor';
import { decorator } from 'jojo/platform/instantiation/common/instantiation';

export const IEditorGroupService = decorator<IEditorGroupService>('editorGroupService');

export interface IEditorGroup {
  activeEditorInput: IEditorInput;

  count: number;

  onEditorStructureChanged: Event<IEditorInput>;

  getEditor(index: number): IEditorInput;

  getEditors(): IEditorInput[];

  isActive(editor: IEditorInput): boolean;
}

export interface IEditorGroupService {
  onEditorChanged: Event<void>;

  onEditorInputChanged: Event<IEditorInput>;

  getEditorGroup(): IEditorGroup;

  openEditor(editor: IEditorInput): Promise<void>;

  closeEditor(editor: IEditorInput): void;
}
