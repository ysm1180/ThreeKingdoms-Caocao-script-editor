import { Disposable, IDisposable, once, toDisposable } from 'jojo/base/common/lifecycle';
import { LinkedList } from 'jojo/base/common/linkedList';
import { IBinaryFileService, IResourceStat } from 'jojo/workbench/services/binaryfile/binaryFiles';
import { BinaryFileService } from 'jojo/workbench/services/binaryfile/binaryFileService';
import { IWorkbenchEditorService, WorkbenchEditorService } from 'jojo/workbench/services/editor/editorService';

export enum Me5ItemState {
  Normal,
  Edit,
}

export class Me5Item extends Disposable implements IResourceStat {
  private static INDEX = 1;

  private _state: Me5ItemState;
  private _parent: Me5Item;
  private _isGroup: boolean;
  private _name: string;
  private _children = new LinkedList<Me5Item>();
  private _dataIndex: number;
  private readonly id = String(Me5Item.INDEX++);

  constructor(
    name: string,
    isGroup: boolean,
    public root: Me5Item,
    index: number,
    @IBinaryFileService private binaryFileService: BinaryFileService,
    @IWorkbenchEditorService private editorService: WorkbenchEditorService
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

  public get state(): Me5ItemState {
    return this._state;
  }

  public set state(state: Me5ItemState) {
    this._state = state;
  }

  public get parent(): Me5Item {
    return this._parent;
  }

  public get isGroup(): boolean {
    return this._isGroup;
  }

  public set isGroup(value: boolean) {
    if (value !== this._isGroup) {
      this._isGroup = value;
      if (this._isGroup) {
        this._children = new LinkedList<Me5Item>();
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
    const model = this.binaryFileService.models.get(input.getResource());
    const data = model.resourceModel.getData(this._dataIndex);
    return Buffer.from(data.buffer.slice(data.byteOffset, data.byteOffset + data.byteLength));
  }

  public get index() {
    return this._dataIndex;
  }

  public set index(value: number) {
    this._dataIndex = value;
  }

  public getChildren(filter?: FilterFuntion<Me5Item>): Me5Item[] {
    const result = this._children.toArray();

    if (!filter) {
      filter = () => true;
    }

    return result.filter(filter);
  }

  public insertChild(child: Me5Item, itemAfter?: Me5Item): IDisposable {
    let remove;
    if (itemAfter) {
      remove = this._children.insertBefore(child, itemAfter);
    } else {
      remove = this._children.push(child);
    }
    return toDisposable(once(remove));
  }

  public getIndex(filter?: FilterFuntion<Me5Item>): number {
    const parent = this._parent;
    if (parent) {
      const children = parent.getChildren(filter);
      return children.indexOf(this);
    } else {
      return -1;
    }
  }

  public build(parent: Me5Item, itemAfter?: Me5Item) {
    this._parent = parent;
    this.registerDispose(this._parent.insertChild(this, itemAfter));
  }
}
