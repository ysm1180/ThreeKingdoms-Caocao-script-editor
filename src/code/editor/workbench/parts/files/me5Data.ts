import { LinkedList } from '../../../../base/common/linkedList';
import { IDisposable, toDisposable, once, Disposable } from '../../../../base/common/lifecycle';
import { IResourceFileSerivce, ResourceFileService } from '../../services/resourceFile/resourceFileService';

export enum ItemState {
    Normal,
    Edit,
}

export type FilterFuntion<T> = (e: T) => boolean;

export class Me5Stat extends Disposable {
    private static INDEX = 1;

    private _resource: string;
    private _state: ItemState;
    private _parent: Me5Stat;
    private _isGroup: boolean;
    private _name: string;
    private _children = new LinkedList<Me5Stat>();
    private _dataIndex: number;
    private readonly id = String(Me5Stat.INDEX++);

    constructor(
        resource: string,
        isGroup: boolean,
        public root: Me5Stat,
        name: string,
        index: number,
        @IResourceFileSerivce private resourceFileService: ResourceFileService,
    ) {
        super();

        this._parent = null;

        if (!this.root) {
            this.root = this;
        }

        this._resource = resource;
        this.isGroup = isGroup;
        this._name = name;
        this._dataIndex = index;
    }

    public getId(): string {
        if (this.isRoot) {
            return this._resource;
        } else {
            return `${this._resource}:${this.id}`;
        }
    }

    public set resource(value: string) {
        this._resource = value;
    }

    public get name(): string {
        return this._name;
    }

    public set name(value: string) {
        this._name = value;
    }

    public get state(): ItemState {
        return this._state;
    }

    public set state(state: ItemState) {
        this._state = state;
    }

    public get parent(): Me5Stat {
        return this._parent;
    }

    public get isGroup(): boolean {
        return this._isGroup;
    }

    public set isGroup(value: boolean) {
        if (value !== this._isGroup) {
            this._isGroup = value;
            if (this._isGroup) {
                this._children = new LinkedList<Me5Stat>();
            } else {
                this._children = undefined;
            }
        }
    }

    public get isRoot(): boolean {
        return this.root === this;
    }

    public get data(): Uint8Array {
        const model = this.resourceFileService.models.get(this.resource);
        const data = model.resourceModel.getData(this._dataIndex);
        return data;
    }

    public set index(value: number) {
        this._dataIndex = value;
    }

    public getChildren(filter?: FilterFuntion<Me5Stat>): Me5Stat[] {
        const result = this._children.toArray();

        if (!filter) {
            filter = () => true;
        }

        return result.filter(filter);
    }

    public insertChild(child: Me5Stat, itemAfter?: Me5Stat): IDisposable {
        let remove;
        if (itemAfter) {
            remove = this._children.insertBefore(child, itemAfter);
        } else {
            remove = this._children.push(child);
        }
        return toDisposable(once(remove));
    }

    public getIndex(filter?: FilterFuntion<Me5Stat>): number {
        const parent = this._parent;
        if (parent) {
            const children = parent.getChildren(filter);
            return children.indexOf(this);
        } else {
            return -1;
        }
    }

    public build(parent: Me5Stat, itemAfter?: Me5Stat) {
        this._parent = parent;
        this.registerDispose(this._parent.insertChild(this, itemAfter));
    }
}