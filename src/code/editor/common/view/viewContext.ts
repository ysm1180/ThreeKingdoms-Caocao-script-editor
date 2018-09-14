import { ViewModel } from '../viewModel/viewModel';

export class ViewContext {
	public readonly model: ViewModel;

	constructor(
		model: ViewModel
		,
	) {
		this.model = model;
	}
}