import { Part } from 'code/editor/workbench/browser/part';
import { DomBuilder, $ } from 'code/base/browser/domBuilder';

export class StatusbarPart extends Part {
    private statusItemContainer: DomBuilder;

    constructor() {
        super();
    }

    public createContent(parent: DomBuilder) : DomBuilder {
        this.statusItemContainer = $(parent);

        return this.statusItemContainer;
    }
}