import { ClassDescriptor } from '../../../../platform/instantiation/descriptor';
import { CompositeViewDescriptor, CompositViewRegistry } from '../../browser/compositeView';
import { EXPLORER_VIEW_ID, Me5ExplorerView } from '../../browser/parts/me5Explorer';
import { ResourceEditorInput } from '../../common/editor/resourceEditorInput';

CompositViewRegistry.registerCompositeView(
    new CompositeViewDescriptor(Me5ExplorerView, EXPLORER_VIEW_ID),
    new ClassDescriptor(ResourceEditorInput)
);
