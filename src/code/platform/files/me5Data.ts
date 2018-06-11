import { Disposable, IDisposable, toDisposable, once } from 'code/base/common/lifecycle';

export interface IEditableItem extends IDisposable  {
    getId(): string;

    getName?(): string;

    setName?(value: string): void;

    setEditable?(value: boolean): void;

    isEditable?(): boolean;

    getParent?(): IEditableItem;

    index?(): number;

    getChildren(filter?: (element: any) => boolean): IEditableItem[];

    hasChildren(): boolean;

    appendChild?(child: any): IDisposable;    

    insertChild?(child: any, afterElement?: any): IDisposable;
}

export interface IMe5ItemData {
    image: any;
    music: any;
}

export abstract class BaseMe5Item extends Disposable implements IEditableItem {
    private editable: boolean;
    private _parent: IEditableItem;
    private _name: string;
    private _isGroup: boolean;

    constructor(group: boolean) {
        super();

        this.editable = false;
        this._isGroup = group;
    }

    public build(parent: IEditableItem, itemAfter: any = null) {
        this._parent = parent;

        if (!itemAfter) {
            this.registerDispose(this.getParent().appendChild(this));
        } else {
            this.registerDispose(this.getParent().insertChild(this, itemAfter));
        }
    }

    public getId(): string {
        return null;
    }

    public getName(): string {
        return this._name;
    }

    public setName(name: string): void {
        this._name = name;
    }

    public isEditable(): boolean {
        return this.editable;
    }

    public setEditable(value: boolean): void {
        this.editable = value;
    }

    public getParent(): IEditableItem {
        return this._parent;
    }

    public get isGroup() {
        return this._isGroup;
    }

    public abstract getChildren(filter?: (element: any) => boolean) : IEditableItem[];
    public abstract hasChildren(): boolean;
}
