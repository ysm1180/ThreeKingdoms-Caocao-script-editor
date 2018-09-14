import { View } from './view/view';
import { TextModel } from '../common/textModel';
import { ViewModel } from '../common/viewModel/viewModel';

export class CodeEditor {
    private domElement: HTMLElement;
    private view: View;

    private viewModel: ViewModel;
    private model: TextModel;

    constructor(
        parent: HTMLElement,
    ) {
        this.domElement = parent;    
    }

    public setModel(model: TextModel) {
        this.model = model;

        if (this.model) {
            this.viewModel = new ViewModel(this.model);

            this.createView();

            this.render();

            this.domElement.appendChild(this.view.domNode.domNode);
        }
    }

    private createView(): void {
        this.view = new View(
            this.viewModel
        );
    }

    public render() {
        this.view.render();
    }
}