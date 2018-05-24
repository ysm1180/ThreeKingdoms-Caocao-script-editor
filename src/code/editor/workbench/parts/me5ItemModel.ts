import * as path from 'path';
import { IEditorInput } from 'code/platform/editor/editor';
import { Image } from '../../browser/image';

export interface IMe5Data {
    getId(): string;

    getChildren(): Me5Group[] | Me5Item[];

    hasChildren(): boolean;

    getName(): string;

    setName(value: string): void;

    setEditable(value: boolean): void;

    isEditable(): boolean;
}

export interface IMe5ItemData {
    image: any;
    music: any;
}

export class Me5Stat {
    private groups: Me5Group[];
    private url: string;

    constructor(url: string) {
        this.url = url;
        this.groups = [];
    }

    public addChild(child: Me5Group): number {
        this.groups.push(child);
        return this.groups.length - 1;
    }

    public getChildren() {
        return this.groups;
    }

    public getId(): string {
        return `${this.url}:stat`;
    }

    public hasChildren(): boolean {
        return this.groups.length !== 0;
    }

    public getName(): string {
        return path.basename(this.url);
    }

    public isEditable(): boolean {
        return false;
    }

    public setEditable(value: boolean) {
        // noop
    }
}

export class Me5Group implements IMe5Data {
    private editable: boolean;
    private parent: Me5Stat;
    private index: number;
    private name: string;
    private children: Me5Item[];

    constructor() {
        this.index = 0;
        this.name = `GROUP_${this.index}`;
        this.children = [];
        this.editable = false;
    }

    public build(parent: Me5Stat, name?: string) {
        this.parent = parent;
        this.index = parent.addChild(this);
        if (!name) {
            name = `GROUP_${this.index}`;
        }
        this.name = name;
    }

    public getId(): string {
        return `${this.parent.getId()}:group-${this.index}`;
    }

    public addChild(child: Me5Item): number {
        this.children.push(child);
        return this.children.length - 1;
    }

    public getChildren() {
        return this.children;
    }

    public hasChildren(): boolean {
        return this.children.length !== 0;
    }

    public getName(): string {
        return this.name;
    }

    public setName(name: string): void {
        this.name = name;
    }

    public isEditable(): boolean {
        return this.editable;
    }

    public setEditable(value: boolean): void {
        this.editable = value;
    }
}

export class Me5Item implements IMe5Data, IEditorInput {
    private editable: boolean;
    private parent: Me5Group;
    private index: number;
    private name: string;
    private image: Image;

    constructor() {
        this.index = 0;
        this.name = `${this.index}`;
        this.editable = false;

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
        return `${this.parent.getId()}:item-${this.index}`;
    }

    public build(parent: Me5Group, name?: string, data?: any) {
        this.parent = parent;
        this.index = this.parent.addChild(this);
        if (!name) {
            name = `${this.index}`;
        }
        this.name = name;

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

    public getName(): string {
        return this.name;
    }

    public setName(name: string): void {
        this.name = name;
    }

    public isEditable(): boolean {
        return this.editable;
    }

    public setEditable(value: boolean): void {
        this.editable = value;
    }
}