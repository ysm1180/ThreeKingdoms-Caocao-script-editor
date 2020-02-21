import { ClassDescriptor } from '../../../../platform/instantiation/descriptors';
import { StatusbarItemAlignment } from '../../../../platform/statusbar/statusbar';
import { ResourceEditorInput } from '../../../common/editor/resourceEditorInput';
import { FileEditorInput } from '../../../parts/files/fileEditorInput';
import { CompositViewRegistry, CompositeViewDescriptor } from '../../compositeView';
import { EditorDescriptor, EditorRegistry } from '../../editor';
import { StatusbarItemDescriptor, StatusbarRegistry } from '../statusbar/statusbar';
import { ControlEditor } from './controlEditor';
import { EXPLORER_VIEW_ID, Me5ExplorerView, me5ExplorerItemContext } from './me5Explorer';
import { ImageViewStatusItem } from './me5ImageViewStatus';
import { ResourceEditor } from './resourceEditor';
import { TextFileEditor } from './textFileEditor';

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
