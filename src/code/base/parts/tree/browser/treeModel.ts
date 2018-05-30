import { TreeContext } from 'code/base/parts/tree/browser/tree';
import { Event, ChainEventStorage } from 'code/base/common/event';
import { IIterator } from 'code/base/common/iterator';
import { IDisposable, dispose } from 'code/base/common/lifecycle';

interface IMap<T> { [id: string]: T; }
interface IItemMap extends IMap<Item> { }

export interface IBaseItemEvent {
    item: Item;
}
export interface IItemRefreshEvent extends IBaseItemEvent { }
export interface IItemChildrenRefreshEvent extends IBaseItemEvent {
    skip: boolean;
}
export interface IItemExpandEvent extends IBaseItemEvent { }
export interface IItemCollapseEvent extends IBaseItemEvent { }
export interface IItemTraitEvent extends IBaseItemEvent {
    trait: string;
}

export interface IFocusEvent {
    focus: any;
}

export class ItemRegistry {
    private items: IMap<{ item: Item, toDispose: IDisposable[] }>;

    public onDidRefreshItem = new ChainEventStorage<IItemRefreshEvent>();
    public onRefreshItemChildren = new ChainEventStorage<IItemChildrenRefreshEvent>();
    public onDidRefreshItemChildren = new ChainEventStorage<IItemChildrenRefreshEvent>();
    public onDidExpandItem = new ChainEventStorage<IItemExpandEvent>();
    public onDidCollapseItem = new ChainEventStorage<IItemCollapseEvent>();
    public onDidAddTraitItem = new ChainEventStorage<IItemTraitEvent>();
    public onDidRemoveTraitItem = new ChainEventStorage<IItemTraitEvent>();
    public onDidDisposeItem = new ChainEventStorage<Item>();

    constructor() {
        this.items = {};
    }

    public register(item: Item): void {

        const toDispose = [
            this.onDidRefreshItem.add(item.onDidRefresh),
            this.onRefreshItemChildren.add(item.onRefreshChildren),
            this.onDidRefreshItemChildren.add(item.onDidRefreshChildren),
            this.onDidExpandItem.add(item.onDidExpand),
            this.onDidCollapseItem.add(item.onDidCollapse),
            this.onDidAddTraitItem.add(item.onDidAddTrait),
            this.onDidRemoveTraitItem.add(item.onDidRemoveTrait),
            this.onDidDisposeItem.add(item.onDidDispose),
        ];

        this.items[item.id] = { item, toDispose };
    }

    public deregister(item: Item): void {
        dispose(this.items[item.id].toDispose);
        delete this.items[item.id];
    }

    public getItem(id: string): Item {
        const result = this.items[id];
        return result ? result.item : null;
    }

    public dispose() {
        this.onDidRefreshItem.dispose();
        this.onRefreshItemChildren.dispose();
        this.onDidRefreshItemChildren.dispose();
        this.onDidExpandItem.dispose();
        this.onDidCollapseItem.dispose();
        this.onDidAddTraitItem.dispose();
        this.onDidRemoveTraitItem.dispose();
        this.onDidDisposeItem.dispose();
    }
}
export class Item {
    private element: any;
    private traits: { [trait: string]: boolean };

    public id: string;

    private doesHaveChildren: boolean;

    private registry: ItemRegistry;
    private context: TreeContext;

    public parent: Item;
    public previous: Item;
    public next: Item;
    public firstChild: Item;
    public lastChild: Item;

    private depth: number;

    private visible: boolean;
    private expanded: boolean;
    private isRefreshChildren: boolean;

    private isDisposed: boolean;

    public onDidRefresh = new Event<IItemRefreshEvent>();
    public onRefreshChildren = new Event<IItemChildrenRefreshEvent>();
    public onDidRefreshChildren = new Event<IItemChildrenRefreshEvent>();
    public onDidExpand = new Event<IItemExpandEvent>();
    public onDidCollapse = new Event<IItemCollapseEvent>();
    public onDidAddTrait = new Event<IItemTraitEvent>();
    public onDidRemoveTrait = new Event<IItemTraitEvent>();
    public onDidDispose = new Event<Item>();

    constructor(id: string, registry: ItemRegistry, context: TreeContext, element: any) {
        this.id = id;
        this.registry = registry;
        this.element = element;
        this.context = context;

        this.registry.register(this);

        this.doesHaveChildren = this.context.dataSource.hasChildren(element);

        this.parent = null;
        this.previous = null;
        this.next = null;
        this.firstChild = null;
        this.lastChild = null;

        this.visible = true;
        this.expanded = false;
        this.isRefreshChildren = true;

        this.depth = 0;
        this.isDisposed = false;

        this.traits = {};
    }

    public getAllTraits(): string[] {
        const result: string[] = [];
        let trait: string;
        for (trait in this.traits) {
            if (this.traits.hasOwnProperty(trait) && this.traits[trait]) {
                result.push(trait);
            }
        }

        return result;
    }

    public getElement(): any {
        return this.element;
    }

    public getDepth(): number {
        return this.depth;
    }

    public isVisible(): boolean {
        return this.visible;
    }

    public isExpanded(): boolean {
        return this.expanded;
    }

    public expand(): Promise<any> {
        if (this.isExpanded() || !this.doesHaveChildren) {
            return Promise.resolve(null);
        }

        const event: IItemExpandEvent = { item: this };

        let result;
        if (this.isRefreshChildren) {
            result = this.refreshChildren(true, true);
        } else {
            result = Promise.resolve(null);
        }

        return result.then(() => {
            this.expanded = true;
            this.onDidExpand.fire(event);
        });
    }

    public collapse() {
        if (!this.isExpanded()) {
            return;
        }

        const event: IItemCollapseEvent = { item: this };
        this.onDidCollapse.fire(event);
        this.expanded = false;
    }

    public getChildren(): Item[] {
        let child = this.firstChild;
        const result = [];
        while (child) {
            result.push(child);
            child = child.next;
        }

        return result;
    }

    public addChild(item: Item, afterItem: Item = this.lastChild): void {
        const isEmpty = this.firstChild === null;
        const atHead = afterItem === null;
        const atTail = afterItem === this.lastChild;

        if (isEmpty) {
            this.firstChild = this.lastChild = item;
            item.next = item.previous = null;
        } else if (atHead) {
            this.firstChild.previous = item;
            item.next = this.firstChild;
            item.previous = null;
            this.firstChild = item;
        } else if (atTail) {
            this.lastChild.next = item;
            item.next = null;
            item.previous = this.lastChild;
            this.lastChild = item;
        } else {
            item.previous = afterItem;
            item.next = afterItem.next;
            afterItem.next.previous = item;
            afterItem.next = item;
        }

        item.parent = this;
        item.depth = this.depth + 1;
    }

    public removeChild(item: Item): void {
        const isFirstChild = item === this.firstChild;
        const isLastChild = item === this.lastChild;

        if (isFirstChild && isLastChild) {
            this.firstChild = this.lastChild = null;
        } else if (isFirstChild) {
            item.next.previous = null;
            this.firstChild = item.next;
        } else if (isLastChild) {
            item.previous.next = null;
            this.lastChild = item.previous;
        } else {
            item.next.previous = item.previous;
            item.previous.next = item.next;
        }

        item.parent = null;
        item.depth = null;
    }

    public hasChildren(): boolean {
        return this.doesHaveChildren;
    }

    public forEachChild(fn: (child: Item) => void): void {
        let child = this.firstChild;
        let next: Item;

        while (child) {
            next = child.next;
            fn(child);
            child = next;
        }
    }

    public mapEachChild<T>(fn: (child: Item) => T): T[] {
        const result: T[] = [];
        this.forEachChild((child) => {
            result.push(fn(child));
        });
        return result;
    }

    private refreshChildren(skipRenderChildren: boolean = false, force: boolean = false) {
        if (!force && !this.isExpanded()) {
            this.isRefreshChildren = true;
            return Promise.resolve(null);
        }

        this.isRefreshChildren = false;

        const doRefresh = () => {
            const event: IItemChildrenRefreshEvent = { item: this, skip: skipRenderChildren };
            this.onRefreshChildren.fire(event);

            if (this.isDisposed) {
                return Promise.resolve(null);
            }

            const children = this.context.dataSource.getChildren(this.element);
            return Promise.resolve(children).then((children) => {
                const staleItems: IItemMap = {};
                while (this.firstChild !== null) {
                    staleItems[this.firstChild.id] = this.firstChild;
                    this.removeChild(this.firstChild);
                }

                for (let i = 0, len = children.length; i < len; i++) {
                    const child = children[i];
                    const id = this.context.dataSource.getId(child);
                    const item = staleItems[id] || new Item(id, this.registry, this.context, child);
                    item.element = child;
                    delete staleItems[id];
                    this.addChild(item);
                }

                for (const staleItemId in staleItems) {
                    if (staleItems.hasOwnProperty(staleItemId)) {
                        staleItems[staleItemId].dispose();
                    }
                }

                return Promise.all(this.mapEachChild((child) => {
                    return child.refresh(skipRenderChildren);
                }));
            }).then(() => {
                this.onDidRefreshChildren.fire(event);
            });
        };

        return doRefresh();
    }

    public refresh(skipRenderChildren: boolean = false): Promise<any> {
        const event: IItemRefreshEvent = { item: this };
        this.onDidRefresh.fire(event);

        return this.refreshChildren(skipRenderChildren);
    }

    public getNavigator() {
        return new ItemNavigator(this);
    }

    public addTrait(trait: string) {
        const eventData: IItemTraitEvent = {
            trait,
            item: this
        };
        this.traits[trait] = true;
        this.onDidAddTrait.fire(eventData);
    }

    public removeTrait(trait: string) {
        const eventData: IItemTraitEvent = {
            trait,
            item: this
        };
        delete this.traits[trait];
        this.onDidRemoveTrait.fire(eventData);
    }

    public hasTrait(trait: string) {
        return this.traits[trait] || false;
    }

    public dispose(): void {
        this.forEachChild((child) => child.dispose());

        this.parent = null;
        this.previous = null;
        this.next = null;
        this.firstChild = null;
        this.lastChild = null;

        this.onDidDispose.fire(this);
        this.registry.deregister(this);

        this.isDisposed = true;
    }
}

export class ItemNavigator implements IIterator<Item> {
    private start: Item;
    private item: Item;

    static lastDescendantOf(item: Item): Item {
        if (!item) {
            return null;
        }

        if (!item.isVisible()) {
            return ItemNavigator.lastDescendantOf(item.previous);
        }

        if (!item.isExpanded() || item.lastChild === null) {
            return item;
        }

        return ItemNavigator.lastDescendantOf(item.lastChild);
    }

    constructor(item: Item, subTreeOnly = true) {
        this.item = item;
        this.start = subTreeOnly ? item : null;
    }

    public current(): Item {
        return this.item || null;
    }

    public next(): Item {
        if (this.item) {
            do {
                if (this.item instanceof RootItem || (this.item.isVisible() && this.item.isExpanded()) && this.item.firstChild) {
                    this.item = this.item.firstChild;
                } else if (this.item === this.start) {
                    this.item = null;
                } else {
                    while (this.item && this.item !== this.start && !this.item.next) {
                        this.item = this.item.parent;
                    }
                    if (this.item === this.start) {
                        this.item = null;
                    }
                    this.item = !this.item ? null : this.item.next;
                }
            } while (this.item && !this.item.isVisible());
        }
        return this.item || null;
    }

    public previous(): Item {
        if (this.item) {
            do {
                const previous = ItemNavigator.lastDescendantOf(this.item.previous);
                if (previous) {
                    this.item = previous;
                } else if (this.item.parent && this.item.parent !== this.start && this.item.parent.isVisible()) {
                    this.item = this.item.parent;
                } else {
                    this.item = null;
                }
            } while (this.item && !this.item.isVisible());
        }
        return this.item || null;
    }

    public parent(): Item {
        if (this.item) {
            const parent = this.item.parent;
            if (parent && parent !== this.start && parent.isVisible()) {
                this.item = parent;
            } else {
                this.item = null;
            }
        }
        return this.item || null;
    }

    public first(): Item {
        this.item = this.start;
        this.next();
        return this.item || null;
    }

    public last(): Item {
        return ItemNavigator.lastDescendantOf(this.start);
    }

}

export class RootItem extends Item {
    constructor(id: string, registry: ItemRegistry, context: TreeContext, element: any) {
        super(id, registry, context, element);
    }

    public isVisible(): boolean {
        return false;
    }

    public isExpanded(): boolean {
        return true;
    }
}

export class TreeModel {
    private root: Item;
    private context: TreeContext;
    private registry: ItemRegistry;
    private traitsToItems: IMap<IItemMap>;

    public onSetRoot = new Event<Item>();
    public onDidSetRoot = new Event<Item>();
    public onDidFocus = new Event<IFocusEvent>();

    public onDidRefreshItem = new Event<IItemRefreshEvent>();
    public onRefreshItemChildren = new Event<IItemChildrenRefreshEvent>();
    public onDidRefreshItemChildren = new Event<IItemChildrenRefreshEvent>();
    public onDidExpandItem = new Event<IItemExpandEvent>();
    public onDidCollapseItem = new Event<IItemCollapseEvent>();
    public onDidAddTraitItem = new Event<IItemTraitEvent>();
    public onDidRemoveTraitItem = new Event<IItemTraitEvent>();
    public onDidChangeHighlight = new Event<void>();

    constructor(context: TreeContext) {
        this.root = null;
        this.context = context;

        this.traitsToItems = {};
    }

    public setRoot(element: any) {
        this.onSetRoot.fire(this.root);

        if (this.root) {
            this.root.dispose();
        }

        if (!element) {
            this.root = null;
            return Promise.resolve(null);
        }

        if (this.registry) {
            this.registry.dispose();
        }

        this.registry = new ItemRegistry();

        this.registry.onDidRefreshItem.set(this.onDidRefreshItem);
        this.registry.onRefreshItemChildren.set(this.onRefreshItemChildren);
        this.registry.onDidRefreshItemChildren.set(this.onDidRefreshItemChildren);
        this.registry.onDidExpandItem.set(this.onDidExpandItem);
        this.registry.onDidCollapseItem.set(this.onDidCollapseItem);
        this.registry.onDidAddTraitItem.set(this.onDidAddTraitItem);
        this.registry.onDidRemoveTraitItem.set(this.onDidRemoveTraitItem);

        const removeTraits = new Event<Item>();
        removeTraits.add((item) => {
            const traits = item.getAllTraits();
            traits.forEach((trait) => {
                delete this.traitsToItems[trait][item.id];
            });
        });
        this.registry.onDidDisposeItem.set(removeTraits);

        const id = this.context.dataSource.getId(element);
        this.root = new RootItem(id, this.registry, this.context, element);

        this.onDidSetRoot.fire(this.root);
        return this.refresh(this.root);
    }

    public getRoot(): any {
        return this.root ? this.root.getElement() : null;
    }

    public refresh(element: any = null, skipRenderChildren: boolean = false) {
        const item = this.getItem(element);

        if (!item) {
            return Promise.resolve(null);
        }

        return item.refresh(skipRenderChildren);
    }

    public getItem(element: any): Item {
        if (element === null) {
            return this.root;
        } else if (element instanceof Item) {
            return element;
        } else if (typeof element === 'string') {
            return this.registry.getItem(element);
        } else {
            return this.registry.getItem(this.context.dataSource.getId(element));
        }
    }

    public isExpanded(element: any): boolean {
        const item = this.getItem(element);

        if (!item) {
            return false;
        }

        return item.isExpanded();
    }

    public toggleExpansion(element: any) {
        if (this.isExpanded(element)) {
            this.collapse(element);
        } else {
            this.expand(element);
        }
    }

    public expand(element: any): Promise<void> {
        const item = this.getItem(element);

        if (!item) {
            return Promise.resolve(null);
        }

        return item.expand();
    }

    public collapse(element: any) {
        const item = this.getItem(element);

        if (!item) {
            return;
        }

        item.collapse();
    }

    public addTraits(trait: string, elements: any[]) {
        const items = this.traitsToItems[trait] || {};

        for (let i = 0, len = elements.length; i < len; i++) {
            const item = this.getItem(elements[i]);
            if (item) {
                item.addTrait(trait);
                items[item.id] = item;
            }
        }

        this.traitsToItems[trait] = items;
    }

    public removeTraits(trait: string, elements: any[]) {
        const items = this.traitsToItems[trait] || {};

        if (elements.length === 0) {
            for (const id in items) {
                if (items.hasOwnProperty(id)) {
                    const item = items[id];
                    item.removeTrait(trait);
                }
            }

            delete this.traitsToItems[trait];
        } else {
            for (let i = 0, len = elements.length; i < len; i++) {
                const item = this.getItem(elements[i]);

                if (item) {
                    item.removeTrait(trait);
                    delete items[item.id];
                }
            }
        }
    }

    public setTraits(trait: string, elements: any[]) {
        this.removeTraits(trait, []);
        this.addTraits(trait, elements);
    }

    public getElementsWithTrait(trait: string): any[] {
        const elements = [];
        const items = this.traitsToItems[trait] || [];
        for (let id in items) {
            if (items.hasOwnProperty(id)) {
                elements.push(items[id].getElement());
            }
        }

        return elements;
    }

    public setSelection(elements: any[]) {
        this.setTraits('selected', elements);
    }

    public getSelection(): any[] {
        return this.getElementsWithTrait('selected');
    }

    public setHightlight(element?: any) {
        this.setTraits('highlight', element ? [element] : []);
    }

    public setFocus(element?: any) {
        this.setTraits('focused', element ? [element] : []);

        const eventData: IFocusEvent = { focus: this.getFocus() };
        this.onDidFocus.fire(eventData);
    }

    public getFocus(): any {
        const result = this.getElementsWithTrait('focused');
        return result.length === 0 ? null : result[0];
    }
}


