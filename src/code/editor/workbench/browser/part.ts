import { DomBuilder, $ } from 'code/base/browser/domBuilder';

export class Part {
    private parent: DomBuilder;
    private content: DomBuilder;

    constructor() {

    }

    public getContainer(): DomBuilder {
        return this.parent;
    }

    public getContentArea(): DomBuilder {
        return this.content;
    }

    public create(parent: DomBuilder) {
        this.parent = parent;
        this.content = this.createContent(parent);
    }

    protected createContent(parent: DomBuilder) {
        return $(parent).div({
            class: 'content'
        });
    }

    public layout(width: number, height: number) {
        if (this.content) {
            this.content.size(width, height);
        }
    }
}