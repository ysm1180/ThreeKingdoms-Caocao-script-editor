import * as Model from 'code/base/parts/tree/browser/treeModel';
import { TreeContext, MouseContextMenuEvent } from 'code/base/parts/tree/browser/tree';
import { ArrayIterator, IIterator } from 'code/base/common/iterator';
import { StandardMouseEvent } from 'code/base/browser/mouseEvent';

export interface IRow {
    element: HTMLElement;
    templateData: any;
}

export class ViewItem {
    private context: TreeContext;

    public model: Model.Item;
    public id: string;

    private row: IRow;

    public styles: any;

    constructor(context: TreeContext, model: Model.Item) {
        this.model = model;
        this.id = this.model.id;
        this.context = context;

        this.styles = {};
    }

    public set expanded(value: boolean) {
        if (value) {
            this.addClass('expanded');
        } else {
            this.removeClass('expanded');
        }
    }

    public addClass(value: string) {
        this.styles[value] = true;
        this.render(true);
    }

    public removeClass(value: string) {
        delete this.styles[value];
        this.render(true);
    }

    private createRow(): IRow {
        const item = document.createElement('div');
        item.classList.add('content');

        const row = document.createElement('div');
        row.appendChild(item);

        return {
            element: row,
            templateData: this.context.renderer.renderTemplate(item),
        };
    }

    public get element(): HTMLElement {
        return this.row && this.row.element;
    }

    public render(skipContextRender: boolean = false) {
        if (!this.element) {
            return;
        }

        const classes = ['tree-row'];
        classes.push(...Object.keys(this.styles));
        if (this.model.hasChildren()) {
            classes.push('has-children');
        }
        this.element.className = classes.join(' ');
        this.element.style.paddingLeft = ((this.model.getDepth() - 1) * this.context.options.indentPixels) + 'px';

        if (!skipContextRender) {
            this.context.renderer.render(this.context.tree, this.model.getElement(), this.row.templateData);
        }
    }

    public insert(container: HTMLElement, afterElement?: HTMLElement) {
        if (!this.row) {
            this.row = this.createRow();
            (<any>this.row.element)['TREE-VIEW'] = this;
        }

        if (this.element.parentElement) {
            return;
        }

        if (afterElement === null) {
            container.appendChild(this.element);
        } else {
            try {
                container.insertBefore(this.element, afterElement);
            } catch (e) {
                container.appendChild(this.element);
            }
        }

        this.render();
    }

    public remove() {
        if (!this.row) {
            return;
        }

        this.element.parentElement.removeChild(this.element);
        this.row = null;
    }
}

export class RootViewItem extends ViewItem {
    constructor(context: TreeContext, model: Model.Item) {
        super(context, model);
    }

    public render(): void {

    }

    public insert(container: HTMLElement, afterElement: HTMLElement): void {
        // no-op
    }

    public remove(): void {
        // no-op
    }
}

export class TreeView {
    private context: TreeContext;
    private model: Model.TreeModel;

    private domNode: HTMLElement;
    private wrapper: HTMLElement;
    private rowContainer: HTMLElement;

    private root: ViewItem;
    private items: { [id: string]: ViewItem };

    private previousRefreshingChildren: { [id: string]: Model.Item[] } = {};

    private indexes: { [id: string]: number };
    private map: ViewItem[];

    constructor(context: TreeContext, container: HTMLElement) {
        this.context = context;

        this.domNode = document.createElement('div');
        this.domNode.className = 'tree';

        this.wrapper = document.createElement('div');
        this.wrapper.className = 'tree-wrapper';

        this.rowContainer = document.createElement('div');
        this.rowContainer.className = 'tree-rows';

        this.wrapper.appendChild(this.rowContainer);
        this.domNode.appendChild(this.wrapper);
        container.appendChild(this.domNode);

        this.model = null;
        this.items = {};
        this.indexes = {};
        this.map = [];

        this.wrapper.addEventListener('click', (e) => this.onClick(e));
        this.domNode.addEventListener('contextmenu', (e) => this.onContextMenu(e));
    }

    private onClick(e: MouseEvent): void {
        const mouseEvent = new StandardMouseEvent(e);
        const item = this.getItemAround(mouseEvent.target);
        
        if (!item) {
            return;
        }

        this.model.setSelection([item.model.getElement()]);
        this.model.toggleExpansion(item.model.getElement());

        this.context.controller.onClick(item.model.getElement());
    }

    private onContextMenu(e: MouseEvent): void {

        const mouseEvent = new StandardMouseEvent(e);
        const item = this.getItemAround(mouseEvent.target);
        if (!item) {
            return;
        }

        this.model.setSelection([item.model.getElement()]);

        const event = new MouseContextMenuEvent(mouseEvent);
        this.context.controller.onContextMenu(item.model.getElement(), event);
    }

    private getItemAround(element: HTMLElement): ViewItem {
        let item: ViewItem = this.root;
        do {
            if ((<any>element)['TREE-VIEW']) {
                item = (<any>element)['TREE-VIEW'];
            }

            if (element === this.domNode || element === this.wrapper) {
                return item;
            }

            if (element === document.body) {
                return null;
            }
        } while (element = element.parentElement);

        return undefined;
    }

    public setModel(model: Model.TreeModel) {
        this.model = model;

        this.model.onSetRoot.add(this.onClearingRoot, this);
        this.model.onDidSetRoot.add(this.onSetRoot, this);

        this.model.onDidRefreshItem.set(this.onItemRefresh, this);
        this.model.onRefreshItemChildren.set(this.onItemChildrenRefresing, this);
        this.model.onDidRefreshItemChildren.set(this.onItemChildrenRefreshed, this);
        this.model.onDidExpandItem.set(this.onDidExpand, this);
        this.model.onDidCollapseItem.set(this.onDidCollapse, this);
        this.model.onDidAddTraitItem.set(this.onItemAddTrait, this);
        this.model.onDidRemoveTraitItem.set(this.onItemRemoveTrait, this);
    }

    public onClearingRoot(item: Model.Item) {
        if (item) {
            this.onRemoveItems(item.getNavigator());
        }
    }

    public onSetRoot(item: Model.Item) {
        this.root = new RootViewItem(this.context, item);
    }

    public onItemAddTrait(e: Model.IItemTraitEvent) {
        const item = <Model.Item>e.item;
        const trait = <string>e.trait;
        const viewItem = this.items[item.id];
        if (viewItem) {
            viewItem.addClass(trait);
        }
    }

    public onItemRemoveTrait(e: Model.IItemTraitEvent) {
        const item = <Model.Item>e.item;
        const trait = <string>e.trait;
        const viewItem = this.items[item.id];
        if (viewItem) {
            viewItem.removeClass(trait);
        }
    }

    public onDidExpand(e: Model.IItemExpandEvent) {
        const item = <Model.Item>e.item;
        const viewItem = this.items[item.id];
        if (viewItem) {
            viewItem.expanded = true;
            this.onInsertItems(item.getNavigator(), item.id);
        }

    }

    public onDidCollapse(e: Model.IItemCollapseEvent) {
        const item = <Model.Item>e.item;
        const viewItem = this.items[item.id];
        if (viewItem) {
            viewItem.expanded = false;
            this.onRemoveItems(item.getNavigator());
        }

    }

    public onItemRefresh(e: Model.IItemRefreshEvent) {
        const item = <Model.Item>e.item;
        const viewItem = this.items[item.id];
        this.refreshItem(viewItem);
    }

    public onItemChildrenRefresing(e: Model.IItemChildrenRefreshEvent) {
        const item = <Model.Item>e.item;
        let child = item.firstChild;
        const children: Model.Item[] = [];
        while (child !== null) {
            children.push(child);
            child = child.next;
        }

        this.previousRefreshingChildren[item.id] = children;
    }

    public onItemChildrenRefreshed(e: Model.IItemChildrenRefreshEvent) {
        const item = <Model.Item>e.item;

        if (!e.skip) {
            const afterRefreshingChildren: Model.Item[] = [];
            let child = item.firstChild;
            while (child !== null) {
                afterRefreshingChildren.push(child);
                child = child.next;
            }

            this.onRemoveItems(new ArrayIterator<Model.Item>(this.previousRefreshingChildren[item.id]));
            this.onInsertItems(new ArrayIterator<Model.Item>(afterRefreshingChildren), item.getDepth() > 0 ? item.id : null);
        }
    }

    // item is contiguous
    public onRemoveItems(iter: IIterator<Model.Item>) {
        let item: Model.Item;
        let index: number;
        let startIndex: number = null;

        while (item = iter.next()) {
            index = this.indexes[item.id];
            const viewItem = this.map[index];

            delete this.indexes[item.id];
            this.onRemoveItem(viewItem);

            if (startIndex === null) {
                startIndex = index;
            }
        }

        if (startIndex !== null) {
            this.map.splice(startIndex, index - startIndex + 1);

            let viewItem: ViewItem;
            for (let i = startIndex; i < this.map.length; i++) {
                viewItem = this.map[i];
                this.indexes[viewItem.id] = i;
            }
        }
    }

    public onRemoveItem(item: ViewItem) {
        this.removeItemFromDOM(item);
        delete this.items[item.id];
    }

    public onInsertItems(iter: IIterator<Model.Item>, afterItemId: string = null) {
        let item: Model.Item;
        let index: number;
        let viewItem: ViewItem;

        if (afterItemId === null) {
            index = 0;
        } else {
            index = this.indexes[afterItemId] + 1;
        }

        const insertedItems: ViewItem[] = [];
        let insertedItemIndex: number = index;
        while (item = iter.next()) {
            viewItem = new ViewItem(this.context, item);
            this.indexes[item.id] = insertedItemIndex++;
            insertedItems.push(viewItem);
        }

        this.map.splice(index, 0, ...insertedItems);

        for (let j = insertedItemIndex; j < this.map.length; j++) {
            viewItem = this.map[j];
            this.indexes[viewItem.id] = j;
        }

        for (let j = insertedItems.length - 1; j >= 0; j--) {
            this.onInsertItem(insertedItems[j]);
        }
    }

    public onInsertItem(item: ViewItem) {
        this.refreshItem(item);
        this.items[item.id] = item;
    }

    private getItemAfter(item: ViewItem) {
        return this.map[this.indexes[item.model.id] + 1] || null;
    }

    public insertItemInDOM(item: ViewItem) {
        let elementAfter: HTMLElement = null;
        const itemAfter = this.getItemAfter(item);
        if (itemAfter && itemAfter.element) {
            elementAfter = itemAfter.element;
        }

        item.insert(this.rowContainer, elementAfter);
    }

    public removeItemFromDOM(item: ViewItem) {
        if (!item) {
            return;
        }

        item.remove();
    }

    public refreshItems(items: Model.Item[]) {

    }

    public refreshItem(item: ViewItem) {
        if (!item) {
            return;
        }

        item.render();

        this.insertItemInDOM(item);
    }

    public focus(): void {
        this.domNode.focus();
    }
}
