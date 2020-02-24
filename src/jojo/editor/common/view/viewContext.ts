import { EditorConfiguration } from 'jojo/editor/browser/config/configuration';
import { ViewEventDispatcher } from 'jojo/editor/common/view/viewEventDispatcher';
import { ViewLayout } from 'jojo/editor/common/viewLayout/viewLayout';
import { IViewModel } from 'jojo/editor/common/viewModel/viewModel';

export class ViewContext {
  public readonly configuration: EditorConfiguration;
  public readonly model: IViewModel;
  public readonly viewLayout: ViewLayout;
  public readonly eventDispatcher: ViewEventDispatcher;

  constructor(configuration: EditorConfiguration, model: IViewModel, eventDispatcher: ViewEventDispatcher) {
    this.model = model;
    this.viewLayout = model.getViewLayout();
    this.configuration = configuration;
    this.eventDispatcher = eventDispatcher;
  }
}
