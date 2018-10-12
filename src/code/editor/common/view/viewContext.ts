import { ViewModel } from '../viewModel/viewModel';
import { ViewLayout } from '../viewLayout/viewLayout';
import { EditorConfiguration } from '../../browser/config/configuration';

export class ViewContext {
	public readonly configuration: EditorConfiguration;
	public readonly model: ViewModel;
	public readonly viewLayout: ViewLayout;

	constructor(
		configuration: EditorConfiguration,
		model: ViewModel,
	) {
		this.model = model;
		this.viewLayout = model.getViewLayout();
		this.configuration = configuration;
	}
}