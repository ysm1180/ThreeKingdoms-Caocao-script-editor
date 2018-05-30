import { Disposable, IDisposable, toDisposable, once } from 'code/base/common/lifecycle';
import { IEditableItemData } from 'code/platform/files/me5Data';

export interface IParentItem {
    getId(): string;

    getChildren(filter?: (element: any) => boolean): any[];

    hasChildren(): boolean;

    appendChild?(child: any): IDisposable;    

    insertChild?(child: any, afterElement?: any): IDisposable;
}

export interface IEditableItemData extends IDisposable  {
    getId(): string;

    getName?(): string;

    setName?(value: string): void;

    setEditable?(value: boolean): void;

    isEditable?(): boolean;

    getParent?(): IParentItem;

    index?(): number;
}

export interface IMe5ItemData {
    image: any;
    music: any;
}

export class BaseMe5Item extends Disposable implements IEditableItemData {
    private editable: boolean;
    private _parent: IParentItem;
    private _name: string;

    constructor() {
        super();

        this.editable = false;
    }

    public build(parent: IParentItem, itemAfter: any = null) {
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

    public getParent(): IParentItem {
        return this._parent;
    }

    
}
