import * as Model from './treeModel';
import { TreeContext } from './tree';
import { ArrayIterator, IIterator } from '../../../common/iterator';
import { StandardMouseEvent } from '../../../browser/mouseEvent';
import { addClass, removeClass } from '../../../browser/dom';
import { MouseContextMenuEvent } from '../../../../platform/events/contextMenuEvent';
import { ScrollableElement } from '../../../browser/ui/scrollbar/scrollbarElement';
import { Disposable } from '../../../common/lifecycle';

export interface IRow {
    element: HTMLElement;
    templateData: any;
}

export class ViewItem extends Disposable {
    private context: TreeContext;

    public model: Model.Item;
    public id: string;

    private row: IRow;

    public styles: any;

    public top: number;
    public height: number;

    constructor(context: TreeContext, model: Model.Item) {
        super();

        this.model = model;
        this.id = this.model.id;
        this.context = context;

        this.top = 0;
        this.height = this.model.getHeight();

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
        this.element.style.height = `${this.height}px`;
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

    public dispose(): void {
        this.model = null;
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
    private scrollableElement: ScrollableElement;

    private root: ViewItem;
    private items: { [id: string]: ViewItem };

    private previousRefreshingChildren: { [id: string]: Model.Item[] } = {};

    private indexes: { [id: string]: number };
    private itemMap: ViewItem[];

    constructor(context: TreeContext, container: HTMLElement) {
        this.context = context;

        this.domNode = document.createElement('div');
        this.domNode.className = 'tree';

        this.wrapper = document.createElement('div');
        this.wrapper.className = 'tree-wrapper';
        this.scrollableElement = new ScrollableElement(this.wrapper, {});
        this.scrollableElement.onScroll.add((e) => {
            this.render(e.scrollTop, e.height, e.scrollLeft, e.width, e.scrollWidth);
        });

        this.rowContainer = document.createElement('div');
        this.rowContainer.className = 'tree-rows';

        this.wrapper.appendChild(this.rowContainer);
        this.domNode.appendChild(this.scrollableElement.getDomNode());
        container.appendChild(this.domNode);

        this.model = null;
        this.items = {};
        this.indexes = {};
        this.itemMap = [];

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

        this.context.controller.onClick(this.context.tree, item.model.getElement());
    }

    private onContextMenu(e: MouseEvent): void {

        const mouseEvent = new StandardMouseEvent(e);
        const item = this.getItemAround(mouseEvent.target);
        if (!item) {
            return;
        }

        this.model.setSelection([item.model.getElement()]);

        const event = new MouseContextMenuEvent(mouseEvent);
        this.context.controller.onContextMenu(this.context.tree, item.model.getElement(), event);
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

        this.model.onDidRefreshItem.add(this.onItemRefresh, this);
        this.model.onRefreshItemChildren.add(this.onItemChildrenRefresing, this);
        this.model.onDidRefreshItemChildren.add(this.onItemChildrenRefreshed, this);
        this.model.onDidExpandItem.add(this.onDidExpand, this);
        this.model.onDidCollapseItem.add(this.onDidCollapse, this);
        this.model.onDidAddTraitItem.add(this.onItemAddTrait, this);
        this.model.onDidRemoveTraitItem.add(this.onItemRemoveTrait, this);
    }

    private onRowsChanged(scrollTop: number = this.scrollTop) {
        this.scrollTop = scrollTop;
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

        if (trait === 'highlight') {
            addClass(this.domNode, trait);
        }
    }

    public onItemRemoveTrait(e: Model.IItemTraitEvent) {
        const item = <Model.Item>e.item;
        const trait = <string>e.trait;
        const viewItem = this.items[item.id];
        if (viewItem) {
            viewItem.removeClass(trait);
        }

        if (trait === 'highlight') {
            removeClass(this.domNode, trait);
        }
    }

    public onDidExpand(e: Model.IItemExpandEvent) {
        const item = <Model.Item>e.item;
        const viewItem = this.items[item.id];
        if (viewItem) {
            viewItem.expanded = true;
            const height = this.onInsertItems(item.getNavigator(), item.id);
            let scrollTop = this.scrollTop;
            if (viewItem.top + viewItem.height <= this.scrollTop) {
				scrollTop += height;
            }
            this.onRowsChanged(scrollTop);
        }
    }

    public onDidCollapse(e: Model.IItemCollapseEvent) {
        const item = <Model.Item>e.item;
        const viewItem = this.items[item.id];
        if (viewItem) {
            viewItem.expanded = false;
            this.onRemoveItems(item.getNavigator());
            this.onRowsChanged();
        }

    }

    public onItemRefresh(e: Model.IItemRefreshEvent) {
        const item = <Model.Item>e.item;
        const viewItem = this.items[item.id];
        this.refreshViewItem(viewItem);
    }

    public onItemChildrenRefresing(e: Model.IItemChildrenRefreshEvent) {
        const item = <Model.Item>e.item;
        const children: Model.Item[] = [];
        const iter = item.getNavigator();
        let child: Model.Item;

        while (child = iter.next()) {
            children.push(child);
        }

        this.previousRefreshingChildren[item.id] = children;
    }

    public onItemChildrenRefreshed(e: Model.IItemChildrenRefreshEvent) {
        const item = <Model.Item>e.item;

        if (!e.skip) {
            const afterRefreshingChildren: Model.Item[] = [];
            const iter = item.getNavigator();
            let child: Model.Item;

            while (child = iter.next()) {
                afterRefreshingChildren.push(child);
            }

            this.onRemoveItems(new ArrayIterator<Model.Item>(this.previousRefreshingChildren[item.id]));
            this.onInsertItems(new ArrayIterator<Model.Item>(afterRefreshingChildren), item.getDepth() > 0 ? item.id : null);
        }
    }

    // item is contiguous
    public onRemoveItems(iter: IIterator<Model.Item>): void {
        let item: Model.Item;
        let index: number;
        let startIndex: number = null;
        let sizeDiff: number = 0;
        let viewItem: ViewItem;

        while (item = iter.next()) {
            index = this.indexes[item.id];
            viewItem = this.itemMap[index];
            sizeDiff -= viewItem.height;

            delete this.indexes[item.id];
            this.onRemoveItem(viewItem);

            if (startIndex === null) {
                startIndex = index;
            }
        }

        if (startIndex !== null) {
            this.itemMap.splice(startIndex, index - startIndex + 1);

            let viewItem: ViewItem;
            for (let i = startIndex; i < this.itemMap.length; i++) {
                viewItem = this.itemMap[i];
                viewItem.top += sizeDiff;
                this.indexes[viewItem.id] = i;
            }
        }
    }

    public onRemoveItem(item: ViewItem) {
        this.removeItemFromDOM(item);
        item.dispose();
        delete this.items[item.id];
    }

    public onInsertItems(iter: IIterator<Model.Item>, afterItemId: string = null): number {
        let item: Model.Item;
        let index: number;
        let viewItem: ViewItem;
        let totalSize: number;

        if (afterItemId === null) {
            index = 0;
            totalSize = 0;
        } else {
            index = this.indexes[afterItemId] + 1;
            viewItem = this.itemMap[index - 1];

            totalSize = viewItem.top + viewItem.height;
        }

        const insertedItems: ViewItem[] = [];
        let insertedItemIndex: number = index;
        let sizeDiff: number = 0;
        while (item = iter.next()) {
            viewItem = new ViewItem(this.context, item);
            viewItem.top = totalSize + sizeDiff;
            
            this.indexes[item.id] = insertedItemIndex++;
            insertedItems.push(viewItem);
            sizeDiff += viewItem.height;
        }

        this.itemMap.splice(index, 0, ...insertedItems);

        for (let j = insertedItemIndex; j < this.itemMap.length; j++) {
            viewItem = this.itemMap[j];
            viewItem.top += sizeDiff;
            this.indexes[viewItem.id] = j;
        }

        for (let j = insertedItems.length - 1; j >= 0; j--) {
            this.onInsertItem(insertedItems[j]);
        }

        return sizeDiff;
    }

    public onInsertItem(item: ViewItem) {
        this.refreshViewItem(item);
        this.items[item.id] = item;
    }

    private getItemAfter(item: ViewItem) {
        return this.itemMap[this.indexes[item.model.id] + 1] || null;
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

    public refreshViewItem(item: ViewItem) {
        if (!item) {
            return;
        }

        item.render();

        this.insertItemInDOM(item);
    }

    public focus(): void {
        this.domNode.focus();
    }

    public isFocused(): boolean {
        return document.activeElement === this.domNode;
    }

    private render(scrollTop: number, viewHeight: number, scrollLeft: number, viewWidth: number, scrollWidth: number): void {
        this.rowContainer.style.top = `${-scrollTop}px`;
    }

    public layout(): void {
        this.viewHeight = this.wrapper.offsetHeight;
        this.scrollHeight = this.getContentHeight();
    }

    public get viewHeight() {
        const scrollDimensions = this.scrollableElement.getScrollDimensions();
        return scrollDimensions.height;
    }

    public set viewHeight(height: number) {
        this.scrollableElement.setScrollDimensions({
            height
        });
    }

    public set scrollHeight(scrollHeight: number) {
        console.log(scrollHeight);
        this.scrollableElement.setScrollDimensions({
            scrollHeight
        });
    }

    public get scrollTop(): number {
		const scrollPosition = this.scrollableElement.getScrollPosition();
		return scrollPosition.scrollTop;
    }
    
    public set scrollTop(scrollTop: number) {
		this.scrollableElement.setScrollDimensions({
			scrollHeight: this.getContentHeight()
		});
		this.scrollableElement.setScrollPosition({
			scrollTop: scrollTop
		});
	}

    public getContentHeight(): number {
        var last = this.itemMap[this.itemMap.length - 1];
        return !last ? 0 : last.top + last.height;
    }
}
