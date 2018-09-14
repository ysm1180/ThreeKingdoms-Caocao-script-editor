import { addClass } from '../../../../base/browser/dom';
import { DomBuilder, $ } from '../../../../base/browser/domBuilder';
import { decorator, ServiceIdentifier } from '../../../../platform/instantiation/instantiation';
import { IContextKeyService, ContextKeyService } from '../../../../platform/contexts/contextKeyService';
import { IInstantiationService } from '../../../../platform/instantiation/instantiationService';
import { StatusbarRegistry, StatusbarItemAlignment } from '../../../../platform/statusbar/statusbar';
import { Part } from '../part';

export const IStatusbarService: ServiceIdentifier<StatusbarPart> = decorator<StatusbarPart>('statusbarPart');

export class StatusbarPart extends Part {
    private statusItemContainer: DomBuilder;

    constructor(
        @IContextKeyService private contextKeyService: ContextKeyService,
        @IInstantiationService private instantiationService: IInstantiationService
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

            this.registerDispose(item.render(el));
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

// class StatusbarEntryItem implements IStatusbarItem {
//     public readonly id: string;

//     constructor(
//         id: string,
//         private text: string,
//         private entry: IStatusbarEntry,
//         private command?: ICommand,
//         private tooltip?: string,
//     ) {
//         this.id = id;
//     }

//     public get when(): ContextKeyExpr {
//         return this.entry.when;
//     }

//     public get alignment(): StatusbarItemAlignment {
//         return this.entry.alignment;
//     }

//     public render(element: HTMLElement) {
//         let itemContainer: HTMLElement;
//         if (this.command) {
//             itemContainer = document.createElement('a');
//         } else {
//             itemContainer = document.createElement('span');
//         }

//         itemContainer.textContent = this.text;
//         itemContainer.title = this.tooltip;

//         element.appendChild(itemContainer);
//     }
// }