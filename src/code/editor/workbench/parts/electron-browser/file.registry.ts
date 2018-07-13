import { EditorRegistry, EditorDescriptor } from '../../browser/editor';
import { Me5ItemViewEditor } from '../../browser/parts/editor/me5/me5ItemViewEditor';
import { ClassDescriptor } from '../../../../platform/instantiation/descriptor';
import { FileEditorInput } from '../files/fileEditorInput';
import { IEditorInput } from '../../../../platform/editor/editor';
import { TextFileEditor } from '../../browser/parts/editor/textFileEditor';

EditorRegistry.registerEditor(
    new EditorDescriptor(Me5ItemViewEditor, Me5ItemViewEditor.ID),
    new ClassDescriptor<IEditorInput>(FileEditorInput)
);

EditorRegistry.registerEditor(
    new EditorDescriptor(TextFileEditor, TextFileEditor.ID),
    new ClassDescriptor<IEditorInput>(FileEditorInput)
);