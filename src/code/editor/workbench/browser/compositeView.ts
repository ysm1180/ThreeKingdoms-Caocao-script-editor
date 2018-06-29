import { DomBuilder } from 'code/base/browser/domBuilder';
import { Disposable } from 'code/base/common/lifecycle';
import { ClassDescriptor } from 'code/platform/instantiation/descriptor';

export abstract class CompositeView extends Disposable {
    private id: string;
    private parent: DomBuilder;

    constructor(
        id: string,
    ) {
        super();

        this.id = id;
    }

    public getId(): string {
        return this.id;
    }

    public create(parent: DomBuilder) {
        this.parent = parent;
    }

    public getContainer(): DomBuilder {
        return this.parent;
    }
}

export class CompositeViewDescriptor {
    public readonly ctor: ClassDescriptor<CompositeView>;
    public readonly id: string;

    constructor(ctor: new (...args: any[]) => CompositeView, id: string) {
        this.ctor = new ClassDescriptor(ctor);
        this.id = id;
    }
}

export const CompositViewRegistry = new class {

    private composites: CompositeViewDescriptor[];

    constructor() {
        this.composites = [];
    }

    public registerCompositeView(descriptor: CompositeViewDescriptor) {
        this.composites.push(descriptor);
    }

    public getCompositeViews() : CompositeViewDescriptor[] {
        return this.composites.slice(0);
    }

    public getCompositeView(id: string): CompositeViewDescriptor {
        for (let i = 0; i < this.composites.length; i++) {
			if (this.composites[i].id === id) {
				return this.composites[i];
			}
		}

		return null;
    }
};