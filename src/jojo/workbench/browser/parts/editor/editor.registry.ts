import { ClassDescriptor } from 'jojo/platform/instantiation/common/descriptors';
import { StatusbarItemAlignment } from 'jojo/platform/statusbar/common/statusbar';
import { CompositViewRegistry, CompositeViewDescriptor } from 'jojo/workbench/browser/compositeView';
import { EditorDescriptor, EditorRegistry } from 'jojo/workbench/browser/editor';
import { ControlEditor } from 'jojo/workbench/browser/parts/editor/controlEditor';
import { EXPLORER_VIEW_ID, Me5ExplorerView, me5ExplorerItemContext } from 'jojo/workbench/browser/parts/editor/me5Explorer';
import { ImageViewStatusItem } from 'jojo/workbench/browser/parts/editor/me5ImageViewStatus';
import { ResourceEditor } from 'jojo/workbench/browser/parts/editor/resourceEditor';
import { TextFileEditor } from 'jojo/workbench/browser/parts/editor/textFileEditor';
import { StatusbarItemDescriptor, StatusbarRegistry } from 'jojo/workbench/browser/parts/statusbar/statusbar';
import { ResourceEditorInput } from 'jojo/workbench/common/editor/resourceEditorInput';
import { FileEditorInput } from 'jojo/workbench/parts/files/fileEditorInput';

EditorRegistry.registerEditor(
  new EditorDescriptor(ResourceEditor, ResourceEditor.ID),
  new ClassDescriptor(ResourceEditorInput)
);

EditorRegistry.registerEditor(
  new EditorDescriptor(TextFileEditor, TextFileEditor.ID),
  new ClassDescriptor(FileEditorInput)
);

EditorRegistry.registerEditor(
  new EditorDescriptor(ControlEditor, ControlEditor.ID),
  new ClassDescriptor(FileEditorInput)
);

StatusbarRegistry.registerStatusbarItem(
  new StatusbarItemDescriptor(
    ImageViewStatusItem,
    ImageViewStatusItem.ID,
    StatusbarItemAlignment.LEFT,
    me5ExplorerItemContext
  )
);

CompositViewRegistry.registerCompositeView(
  new CompositeViewDescriptor(Me5ExplorerView, EXPLORER_VIEW_ID),
  new ClassDescriptor(ResourceEditorInput)
);
