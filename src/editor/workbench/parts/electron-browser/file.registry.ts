import { EditorDescriptor, EditorRegistry } from '../../browser/editor';

import { ClassDescriptor } from '../../../../platform/instantiation/descriptor';
import { ControlEditor } from '../../browser/parts/editor/controlEditor';
import { FileEditorInput } from '../files/fileEditorInput';
import { IEditorInput } from '../../../../platform/editor/editor';
import { ResourceEditorInput } from '../../common/editor/resourceEditorInput';
import { ResourceViewEditor } from '../../browser/parts/editor/resourceViewEditor';
import { TextFileEditor } from '../../browser/parts/editor/textFileEditor';

EditorRegistry.registerEditor(
  new EditorDescriptor(ResourceViewEditor, ResourceViewEditor.ID),
  new ClassDescriptor<IEditorInput>(ResourceEditorInput)
);

EditorRegistry.registerEditor(
  new EditorDescriptor(TextFileEditor, TextFileEditor.ID),
  new ClassDescriptor<IEditorInput>(FileEditorInput)
);

EditorRegistry.registerEditor(
  new EditorDescriptor(ControlEditor, ControlEditor.ID),
  new ClassDescriptor<IEditorInput>(FileEditorInput)
);
