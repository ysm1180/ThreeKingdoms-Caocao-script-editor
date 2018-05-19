import * as path from 'path';
import { IEditorInput } from 'code/platform/editor/editor';

export interface IMe5Data {
    getId(): string;
    getChildren(): Me5Group[] | Me5Item[];
    hasChildren(): boolean;
    getName(): string;
}

export interface IMe5ItemData {
    image: any;
    music: any;
}

export class Me5Stat implements IMe5Data {
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
}

export class Me5Group implements IMe5Data {
    private parent: Me5Stat;
    private index: number;
    private name: string;
    private children: Me5Item[];

    constructor() {
        this.index = 0;
        this.name = `GROUP_${this.index}`;
        this.children = [];
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
}

export class Me5Item implements IMe5Data, IEditorInput {
    private parent: Me5Group;
    private data: Uint8Array;
    private index: number;
    private name: string;

    constructor() {
        this.index = 0;
        this.data = null;
        this.name = `${this.index}`;
    }

    public getResource() {

    }

    public getType() {
        return 'image';
    }

    public resolve() {
        return Promise.resolve(this.data);
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
        this.data = data;
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
}