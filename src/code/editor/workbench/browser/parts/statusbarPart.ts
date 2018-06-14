import { addClass } from 'code/base/browser/dom';
import { IDisposable } from 'code/base/common/lifecycle';
import { DomBuilder, $ } from 'code/base/browser/domBuilder';
import { ICommand } from 'code/platform/commands/commands';
import { ContextKeyExpr } from 'code/platform/contexts/contextKey';
import { decorator } from 'code/platform/instantiation/instantiation';
import { IContextKeyService, ContextKeyService } from 'code/platform/contexts/contextKeyService';
import { IInstantiationService, InstantiationService } from 'code/platform/instantiation/instantiationService';
import { StatusbarRegistry, IStatusbarItem, StatusbarItemAlignment, IStatusbarEntry, } from 'code/platform/statusbar/statusbar';
import { Part } from 'code/editor/workbench/browser/part';

export const IStatusbarService = decorator<StatusbarPart>('statusbarPart');

export class StatusbarPart extends Part {
    private statusItemContainer: DomBuilder;
    private toDispose: IDisposable;

    constructor(
        @IContextKeyService private contextKeyService: ContextKeyService,
        @IInstantiationService private instantiationService: InstantiationService
    ) {
        super();
    }

    public createContent(parent: DomBuilder): DomBuilder {
        this.statusItemContainer = $(parent);

        let items = StatusbarRegistry.getAllStatusbarItem();
        const left = items.filter(d => d.alignment === StatusbarItemAlignment.LEFT).sort((a, b) => b.priority - a.priority);
        const right = items.filter(d => d.alignment === StatusbarItemAlignment.RIGHT).sort((a, b) => a.priority - b.priority);
        right.concat(left).forEach(d => {
            const item = this.instantiationService.create(d.ctor, { alignment: d.alignment, when: d.when, priority: d.priority });
            const el = this.createStatusElement(d.id, d.alignment);

            this.toDispose = item.render(el);
            this.statusItemContainer.append(el);
        });

        this.update();

        return this.statusItemContainer;
    }

    public getItemElements(): HTMLElement[] {
        const items = [];

        const children = this.statusItemContainer.getHTMLElement().children;
        for (let i = 0; i < children.length; i++) {
            const childElement = <HTMLElement>children.item(i);
            items.push(childElement);
        }

        return items;
    }

    public update() {
        let items = StatusbarRegistry.getAllStatusbarItem();
        const idArray = items.filter(d => d.when ? d.when.evaluate(this.contextKeyService.getContext()) : true).map(d => d.id);

        const elements = this.getItemElements();
        elements.forEach((element) => {
            if (idArray.indexOf(element.id) === -1) {
                element.style.display = 'none';
            } else {
                element.style.display = '';
            }
        });
    }

    private createStatusElement(id: string, alignment: StatusbarItemAlignment) {
        const element = document.createElement('div');
        addClass(element, 'statusbar-item');

        if (alignment === StatusbarItemAlignment.RIGHT) {
            addClass(element, 'right');
        } else {
            addClass(element, 'left');
        }

        element.id = id;

        return element;
    }
}

class StatusbarEntryItem implements IStatusbarItem {
    public readonly id: string;

    constructor(
        id: string,
        private text: string,
        private entry: IStatusbarEntry,
        private command?: ICommand,
        private tooltip?: string,
    ) {
        this.id = id;
    }

    public get when(): ContextKeyExpr {
        return this.entry.when;
    }

    public get alignment(): StatusbarItemAlignment {
        return this.entry.alignment;
    }

    public render(element: HTMLElement) {
        let itemContainer: HTMLElement;
        if (this.command) {
            itemContainer = document.createElement('a');
        } else {
            itemContainer = document.createElement('span');
        }

        itemContainer.textContent = this.text;
        itemContainer.title = this.tooltip;

        element.appendChild(itemContainer);
    }
}