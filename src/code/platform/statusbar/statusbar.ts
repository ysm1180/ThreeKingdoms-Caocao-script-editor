import { ContextKeyExpr } from 'code/platform/contexts/contextKey';
import { ClassDescriptor } from 'code/platform/instantiation/descriptor';

export class StatusbarItemDescriptor {
    public readonly ctor: ClassDescriptor<IStatusbarItem>;
    public readonly id: string;
    public readonly alignment: StatusbarItemAlignment;
    public readonly when: ContextKeyExpr;
    public readonly priority: number;

    constructor(ctor: new (...args: any[]) => IStatusbarItem, id: string, alignment?: StatusbarItemAlignment, when?: ContextKeyExpr, priority?: number) {
        this.ctor = new ClassDescriptor(ctor);
        this.id = id;
        this.alignment = alignment;
        this.when = when;
        this.priority = priority;
    }
}

export const enum StatusbarItemAlignment {
    LEFT,
    RIGHT,
}

export interface IStatusbarItem {
    when?: ContextKeyExpr;
    alignment?: StatusbarItemAlignment;
    priority?: number;
    render(element: HTMLElement);
}

export interface IStatusbarEntry {
    alignment: StatusbarItemAlignment;
    priority?: number;
    when?: ContextKeyExpr;
}

export const StatusbarRegistry = new class {
    private _items: StatusbarItemDescriptor[];

    constructor() {
        this._items = [];
    }

    public registerStatusbarItem(item: StatusbarItemDescriptor) {
        this._items.push(item);
    }

    public getAllStatusbarItem() : StatusbarItemDescriptor[] {
        return this._items.slice(0);
    }
};