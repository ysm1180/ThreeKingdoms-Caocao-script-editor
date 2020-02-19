import { IEditorInput } from '../../../platform/editor/editor';
import { ClassDescriptor } from '../../../platform/instantiation/descriptors';
import { EditorDescriptor, EditorRegistry } from '../../browser/editor';
import { ControlEditor } from '../../browser/parts/editor/controlEditor';
import { ResourceViewEditor } from '../../browser/parts/editor/resourceViewEditor';
import { TextFileEditor } from '../../browser/parts/editor/textFileEditor';
import { ResourceEditorInput } from '../../common/editor/resourceEditorInput';
import { FileEditorInput } from '../files/fileEditorInput';

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
