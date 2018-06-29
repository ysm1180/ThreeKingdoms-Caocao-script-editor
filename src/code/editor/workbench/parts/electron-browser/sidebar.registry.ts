import { CompositViewRegistry, CompositeViewDescriptor } from 'code/editor/workbench/browser/compositeView';
import { Me5ExplorerView, EXPLORER_VIEW_ID } from 'code/editor/workbench/browser/parts/me5Explorer';

CompositViewRegistry.registerCompositeView(new CompositeViewDescriptor(
    Me5ExplorerView,
    EXPLORER_VIEW_ID,
));