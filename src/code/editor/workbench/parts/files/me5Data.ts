import { isNull } from 'code/base/common/types';
import { LinkedList } from 'code/base/common/linkedList';
import { IDisposable, toDisposable, once } from 'code/base/common/lifecycle';
import { IEditorInput } from 'code/platform/editor/editor';
import { BaseMe5Item, IEditableItem } from 'code/platform/files/me5Data';
import { ImageData } from 'code/editor/workbench/common/imageData';
import { AudioData } from 'code/editor/workbench/common/audioData';

export class Me5Stat extends BaseMe5Item {
    private children = new LinkedList<IEditableItem>();

    constructor(private url: string) {
        super(true);
    }

    public getId(): string {
        return `${this.url}`;
    }

    public appendChild(child: Me5Group): IDisposable {
        const remove = this.children.push(child);
        return toDisposable(once(remove));
    }

    public getChildren(filter?: (group: IEditableItem) => boolean): IEditableItem[] {
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

export class Me5Group extends BaseMe5Item {
    private static INDEX = 1;
    private readonly id = String(Me5Group.INDEX++);

    private children = new LinkedList<Me5Item>();

    constructor() {
        super(true);
    }

    public getId(): string {
        return `${this.getParent().getId()}:group-${this.id}`;
    }

    public build(parent: IEditableItem, itemAfter = null, name?: string) {
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


export const enum Me5ItemType {
    Unknown,
    Image,
    Audio,
}

export class Me5Item extends BaseMe5Item implements IEditorInput {
    private static INDEX = 1;
    private readonly id = String(Me5Item.INDEX++);

    private type: Me5ItemType;

    private image: ImageData;
    private audio: AudioData;

    constructor() {
        super(false);

        this.image = null;
    }

    public getType(): Me5ItemType {
        return this.type;
    }

    public resolve() {
        return Promise.resolve({
            type: this.type,
            image: this.image,
            audio: this.audio,
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
        this.setData(data);
    }

    public setData(bytes: Uint8Array) {
        if (!isNull(ImageData.getImageType(bytes))) {
            this.type = Me5ItemType.Image;

            this.image = new ImageData();
            this.image.build(bytes);

            this.audio = null;
        } else if (!isNull(AudioData.getMusicType(bytes))) {
            this.type = Me5ItemType.Audio;

            this.audio = new AudioData();
            this.audio.build(bytes);

            this.image = null;
        }
    }

    public get data(): Uint8Array {
        if (this.image) {
            return this.image.data;
        } else {
            return this.audio.data;
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

    public hasChildren(): boolean {
        return false;
    }

    public getChildren() {
        return [];
    }
}