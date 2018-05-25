import { Disposable, IDisposable, toDisposable, once } from 'code/base/common/lifecycle';
import { LinkedList } from 'code/base/common/linkedList';
import { IMe5Data } from 'code/platform/files/me5Data';

export interface IMe5Data extends IDisposable  {
    getId(): string;

    getChildren(): IMe5Data[];

    hasChildren(): boolean;

    addChild?(child: IMe5Data): IDisposable;

    getName?(): string;

    setName?(value: string): void;

    setEditable?(value: boolean): void;

    isEditable?(): boolean;

    getParent?(): IMe5Data;

    find?(item: IMe5Data): number;
}

export interface IMe5ItemData {
    image: any;
    music: any;
}


export class BaseMe5Item extends Disposable implements IMe5Data {
    private editable: boolean;
    private children = new LinkedList<IMe5Data>();
    private _parent: IMe5Data;
    private _name: string;

    constructor() {
        super();

        this.editable = false;
    }

    public build(parent: IMe5Data) {
        this._parent = parent;

        this.registerDispose(this.getParent().addChild(this));
    }

    public getId(): string {
        return null;
    }

    public addChild(child: IMe5Data): IDisposable {
        const remove = this.children.push(child);
        return toDisposable(once(remove));
    }

    public getChildren() {
        return this.children.toArray();
    }

    public hasChildren(): boolean {
        return this.children.toArray().length !== 0;
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

    public getParent(): IMe5Data {
        return this._parent;
    }
}
