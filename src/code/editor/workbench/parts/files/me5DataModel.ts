import { Disposable, IDisposable, toDisposable, once } from 'code/base/common/lifecycle';
import { LinkedList } from 'code/base/common/linkedList';
import { IEditorInput } from 'code/platform/editor/editor';
import { IMe5Data, BaseMe5Item } from 'code/platform/files/me5Data';
import { Image } from 'code/editor/browser/image';

export class Me5Stat extends Disposable implements IMe5Data {
    private children = new LinkedList<Me5Group>();
    private url: string;

    constructor(url: string) {
        super();

        this.url = url;
    }

    public addChild(child: Me5Group): IDisposable {
        const remove = this.children.push(child);
        return toDisposable(once(remove));
    }

    public getChildren() {
        return this.children.toArray();
    }

    public getId(): string {
        return `${this.url}`;
    }

    public hasChildren(): boolean {
        return this.children.toArray().length !== 0;
    }
}

export class Me5Group extends BaseMe5Item {
    private static INDEX = 1;
    private readonly id = String(Me5Group.INDEX++);

    constructor() {
        super();
    }

    public getId(): string {
        return `${this.getParent().getId()}:group-${this.id}`;
    }

    public build(parent: Me5Stat, name?: string) {
        super.build(parent);

        if (!name) {
            name = `GROUP`;
        }
        this.setName(name);
    }
}

export class Me5Item extends BaseMe5Item implements IEditorInput {
    private static INDEX = 1;
    private readonly id = String(Me5Item.INDEX++);

    private image: Image;

    constructor() {
        super();

        this.image = null;
    }

    public getResource() {

    }

    public getType() {
        return this.image !== null ? 'image' : 'music';
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

    public build(parent: Me5Group, name?: string, data?: any) {
        super.build(parent);

        const index = this.getParent().getChildren().indexOf(this);
        if (!name) {
            name = `ITEM_${index}`;
        }
        this.setName(name);

        if (Image.getType(data)) {
            this.image = new Image();
            this.image.build(data);
        }
    }

    public getChildren() {
        return [];
    }

    public hasChildren(): boolean {
        return false;
    }
}