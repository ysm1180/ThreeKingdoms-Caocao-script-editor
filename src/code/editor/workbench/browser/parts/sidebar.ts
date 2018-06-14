import { DomBuilder, $ } from 'code/base/browser/domBuilder';
import { IDisposable, dispose } from 'code/base/common/lifecycle';
import { IInstantiationService, InstantiationService } from 'code/platform/instantiation/instantiationService';
import { Part } from 'code/editor/workbench/browser/part';
import { IView } from 'code/editor/workbench/browser/view';
import { Me5ExplorerView } from 'code/editor/workbench/browser/parts/me5Explorer';

export class SidebarPart extends Part {
    private viewContainer: DomBuilder;
    private views: DomBuilder[];

    private toDispose: IDisposable[];

    constructor(
        @IInstantiationService private instantiationService: InstantiationService
    ) {
        super();

        this.viewContainer = null;
        this.views = [];

        this.toDispose = [];
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

        this.toDispose.push(...viewItems);
    }

    public layout(width: number, height: number) {
        super.layout(width, height);

        this.views.forEach((view) => {
            view.size(undefined, height / this.views.length);
        });
    }

    public dispose() {
        dispose(this.toDispose);
    }
}