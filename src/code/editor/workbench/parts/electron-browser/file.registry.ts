import { EditorRegistry, EditorDescriptor } from '../../browser/editor';
import { ResourceViewEditor } from '../../browser/parts/editor/binaryViewEditor';
import { ClassDescriptor } from '../../../../platform/instantiation/descriptor';
import { FileEditorInput } from '../files/fileEditorInput';
import { IEditorInput } from '../../../../platform/editor/editor';
import { TextFileEditor } from '../../browser/parts/editor/textFileEditor';
import { ControlEditor } from '../../browser/parts/editor/controlEditor';
import { BinaryFileEditorInput } from '../../common/editor/binaryEditorInput';

EditorRegistry.registerEditor(
    new EditorDescriptor(ResourceViewEditor, ResourceViewEditor.ID),
    new ClassDescriptor<IEditorInput>(BinaryFileEditorInput)
);

EditorRegistry.registerEditor(
    new EditorDescriptor(TextFileEditor, TextFileEditor.ID),
    new ClassDescriptor<IEditorInput>(FileEditorInput)
);

EditorRegistry.registerEditor(
    new EditorDescriptor(ControlEditor, ControlEditor.ID),
    new ClassDescriptor<IEditorInput>(FileEditorInput)
);