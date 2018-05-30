import { IDisposable, toDisposable, once } from 'code/base/common/lifecycle';
import { LinkedList } from 'code/base/common/linkedList';
import { IEditorInput } from 'code/platform/editor/editor';
import { BaseMe5Item, IParentItem } from 'code/platform/files/me5Data';
import { Image } from 'code/editor/browser/image';
import { ContextKey } from 'code/platform/contexts/contextKey';

export const ExplorerGroupContext = new ContextKey<boolean>(false);

export class Me5Stat implements IParentItem {
    private children = new LinkedList<Me5Group>();
    private url: string;

    constructor(url: string) {
        this.url = url;
    }

    public getId(): string {
        return `${this.url}`;
    }

    public appendChild(child: Me5Group): IDisposable {
        const remove = this.children.push(child);
        return toDisposable(once(remove));
    }

    public getChildren(filter?: (group: Me5Group) => boolean): Me5Group[] {
        const result = this.children.toArray();

        if (!filter) {
            filter = () => true;
        }
        return result.filter(filter);
    }

    public hasChildren(): boolean {
        return this.children.toArray().length !== 0;
    }

    public insertChild(child: Me5Group, itemAfter: Me5Group): IDisposable {
        const remove = this.children.insertBefore(child, itemAfter);
        return toDisposable(once(remove));
    }
}

export class Me5Group extends BaseMe5Item implements IParentItem {
    private static INDEX = 1;
    private readonly id = String(Me5Group.INDEX++);

    private children = new LinkedList<Me5Item>();

    constructor() {
        super();
    }

    public getId(): string {
        return `${this.getParent().getId()}:group-${this.id}`;
    }

    public build(parent: IParentItem, itemAfter = null, name?: string) {
        super.build(parent, itemAfter);

        if (!name) {
            name = `GROUP`;
        }
        this.setName(name);
    }

    public appendChild(child: Me5Item): IDisposable {
        const remove = this.children.push(child);
        return toDisposable(once(remove));
    }

    public getChildren() {
        return this.children.toArray();
    }

    public hasChildren(): boolean {
        return this.children.toArray().length !== 0;
    }

    public insertChild(child: Me5Item, itemAfter: Me5Item): IDisposable {
        const remove = this.children.insertBefore(child, itemAfter);
        return toDisposable(once(remove));
    }

    public index(): number {
        const parent = this.getParent() as Me5Stat;
        if (parent) {
            const items = parent.getChildren((group) => group.getChildren().length !== 0);
            return items.indexOf(this);
        } else {
            return -1;
        }
    }
}

export class Me5Item extends BaseMe5Item implements IEditorInput {
    private static INDEX = 1;
    private readonly id = String(Me5Item.INDEX++);

    private type: string;

    private image: Image;

    constructor() {
        super();

        this.image = null;
    }

    public getType() {
        return this.type;
    }

    public resolve() {
        return Promise.resolve({
            image: this.image,
            music: null,
        });
    }

    public getId(): string {
        return `${this.getParent().getId()}:item-${this.id}`;
    }

    public build(parent: Me5Group, itemAfter = null, name?: string, data?: any) {
        super.build(parent);

        const index = this.getParent().getChildren().indexOf(this);
        if (!name) {
            name = `ITEM_${index}`;
        }
        this.setName(name);

        if (Image.getImageType(data)) {
            this.type = 'image';

            this.image = new Image();
            this.image.build(data);
        }
    }

    public get data(): Uint8Array {
        if (this.image) {
            return this.image.data;
        } else {
            return null;
        }
    }

    public index(): number {
        const parent = this.getParent() as Me5Group;
        if (parent) {
            const items = parent.getChildren();
            return items.indexOf(this);
        } else {
            return -1;
        }
    }
}