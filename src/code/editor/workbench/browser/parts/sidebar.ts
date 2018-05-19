import { DomBuilder, $ } from 'code/base/browser/domBuilder';
import { Me5ExplorerView } from 'code/editor/workbench/browser/parts/me5Explorer';
import { Part } from 'code/editor/workbench/browser/part';
import { IView } from 'code/editor/workbench/browser/view';
import { IInstantiationService, InstantiationService } from 'code/platform/instantiation/instantiationService';

export class Sidebar extends Part {
    private viewContainer: DomBuilder;
    private views: DomBuilder[];

    constructor(
        @IInstantiationService private instantiationService: InstantiationService
    ) {
        super();

        this.viewContainer = null;
        this.views = [];
    }

    public create(parent: DomBuilder) {
        super.create(parent);

        this.viewContainer = $().div({
            class: 'view-container'
        });
        
        this.addViews(this.instantiationService.create(Me5ExplorerView));

        this.viewContainer.build(this.getContentArea());
    }

    private addViews(...viewItems: IView[]) {
        viewItems.forEach((viewItem) => {
            const view = $().div({
                class: 'view'
            }).appendTo(this.viewContainer);
            viewItem.create(view.getHTMLElement());
            this.views.push(view);
        });
    }

    public layout(width: number, height: number) {
        super.layout(width, height);

        this.views.forEach((view) => {
            view.size(undefined, height / this.views.length);
        });
    }
}