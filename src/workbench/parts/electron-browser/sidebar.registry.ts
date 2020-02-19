import { ClassDescriptor } from '../../../platform/instantiation/descriptors';
import { CompositViewRegistry, CompositeViewDescriptor } from '../../browser/compositeView';
import { EXPLORER_VIEW_ID, Me5ExplorerView } from '../../browser/parts/editor/me5Explorer';
import { ResourceEditorInput } from '../../common/editor/resourceEditorInput';

CompositViewRegistry.registerCompositeView(
  new CompositeViewDescriptor(Me5ExplorerView, EXPLORER_VIEW_ID),
  new ClassDescriptor(ResourceEditorInput)
);
