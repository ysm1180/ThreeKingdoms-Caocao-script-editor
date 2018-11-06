import { LinkedList } from '../../../../base/common/linkedList';
import { IResourceFileService } from '../../services/resourceFile/resourcefiles';
import { Disposable, once, toDisposable, IDisposable } from '../../../../base/common/lifecycle';
import { ResourceFileService } from '../../services/resourceFile/resourceFileService';
import { IWorkbenchEditorService, WorkbenchEditorService } from '../../services/editor/editorService';
import { IResourceStat, FilterFuntion } from '../../services/resourceFile/resourceDataService';

export enum ItemState {
    Normal,
    Edit,
}


export class Me5Stat extends Disposable implements IResourceStat {
    private static INDEX = 1;

    private _state: ItemState;
    private _parent: Me5Stat;
    private _isGroup: boolean;
    private _name: string;
    private _children = new LinkedList<Me5Stat>();
    private _dataIndex: number;
    private readonly id = String(Me5Stat.INDEX++);

    constructor(
        name: string,
        isGroup: boolean,
        public root: Me5Stat,
        index: number,
        @IResourceFileService private resourceFileService: ResourceFileService,
        @IWorkbenchEditorService private editorService: WorkbenchEditorService,
    ) {
        super();

        this._parent = null;

        if (!this.root) {
            this.root = this;
        }

        this.isGroup = isGroup;
        this._name = name;
        this._dataIndex = index;
    }

    public getId(): string {
        return `${this.id}`;
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

    public get data(): Buffer {
        const input = this.editorService.getActiveEditorInput();
        const model = this.resourceFileService.models.get(input.getResource());
        const data = model.resourceModel.getData(this._dataIndex);
        return Buffer.from(data.buffer.slice(data.byteOffset, data.byteOffset + data.byteLength));
    }

    public get index() {
        return this._dataIndex;
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