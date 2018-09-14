import { CompositViewRegistry, CompositeViewDescriptor } from '../../browser/compositeView';
import { Me5ExplorerView, EXPLORER_VIEW_ID } from '../../browser/parts/me5Explorer';
import { ClassDescriptor } from '../../../../platform/instantiation/descriptor';
import { ResourceEditorInput } from '../../common/editor/resourceEditorInput';

CompositViewRegistry.registerCompositeView(new CompositeViewDescriptor(
    Me5ExplorerView,
    EXPLORER_VIEW_ID,
), new ClassDescriptor(ResourceEditorInput));