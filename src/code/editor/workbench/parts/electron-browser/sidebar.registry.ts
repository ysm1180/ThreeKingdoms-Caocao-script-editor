import { CompositViewRegistry, CompositeViewDescriptor } from '../../browser/compositeView';
import { Me5ExplorerView, EXPLORER_VIEW_ID } from '../../browser/parts/me5Explorer';

CompositViewRegistry.registerCompositeView(new CompositeViewDescriptor(
    Me5ExplorerView,
    EXPLORER_VIEW_ID,
));