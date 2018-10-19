import { ViewModel } from '../viewModel/viewModel';
import { ViewLayout } from '../viewLayout/viewLayout';
import { EditorConfiguration } from '../../browser/config/configuration';
import { ViewEventDispatcher } from './viewEventDispatcher';

export class ViewContext {
	public readonly configuration: EditorConfiguration;
	public readonly model: ViewModel;
	public readonly viewLayout: ViewLayout;
	public readonly eventDispatcher: ViewEventDispatcher;

	constructor(
		configuration: EditorConfiguration,
		model: ViewModel,
		eventDispatcher: ViewEventDispatcher,
	) {
		this.model = model;
		this.viewLayout = model.getViewLayout();
		this.configuration = configuration;
		this.eventDispatcher = eventDispatcher;
	}
}