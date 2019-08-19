import { DomBuilder } from '../../../base/browser/domBuilder';
import { Disposable } from '../../../base/common/lifecycle';
import { IEditorInput } from '../../../platform/editor/editor';
import { ClassDescriptor } from '../../../platform/instantiation/descriptor';

export abstract class CompositeView extends Disposable {
    private id: string;
    private parent: DomBuilder;

    constructor(id: string) {
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

    public abstract layout(): void;
}

export class CompositeViewDescriptor {
    public readonly ctor: ClassDescriptor<CompositeView>;
    public readonly id: string;

    constructor(ctor: new (...args: any[]) => CompositeView, id: string) {
        this.ctor = new ClassDescriptor(ctor);
        this.id = id;
    }
}

const INPUT_DESCRIPTORS_PROPERTY = '__$inputDescriptors';

export const CompositViewRegistry = new (class {
    composites: CompositeViewDescriptor[];

    constructor() {
        this.composites = [];
    }

    public registerCompositeView(
        descriptor: CompositeViewDescriptor,
        editorInputDescriptor: ClassDescriptor<IEditorInput>
    ) {
        descriptor[INPUT_DESCRIPTORS_PROPERTY] = editorInputDescriptor;
        this.composites.push(descriptor);
    }

    public getCompositeViewDescriptors(
        input: IEditorInput
    ): CompositeViewDescriptor[] {
        const findCompositViewDescriptors = (
            input: IEditorInput,
            byInstanceOf?: boolean
        ): CompositeViewDescriptor[] => {
            const matchingDescriptors: CompositeViewDescriptor[] = [];

            for (let i = 0; i < this.composites.length; i++) {
                const composit = this.composites[i];
                const inputDescriptor = <ClassDescriptor<IEditorInput>>(
                    composit[INPUT_DESCRIPTORS_PROPERTY]
                );
                const inputClass = inputDescriptor.ctor;

                // Direct check on constructor type (ignores prototype chain)
                if (!byInstanceOf && input.constructor === inputClass) {
                    matchingDescriptors.push(composit);
                }

                // Normal instanceof check
                else if (byInstanceOf && input instanceof inputClass) {
                    matchingDescriptors.push(composit);
                }
            }

            // If no descriptors found, continue search using instanceof and prototype chain
            if (!byInstanceOf && matchingDescriptors.length === 0) {
                return findCompositViewDescriptors(input, true);
            }

            if (byInstanceOf) {
                return matchingDescriptors;
            }

            return matchingDescriptors;
        };

        return findCompositViewDescriptors(input);
    }

    public getCompositeViewDescriptor(id: string): CompositeViewDescriptor {
        for (let i = 0; i < this.composites.length; i++) {
            if (this.composites[i].id === id) {
                return this.composites[i];
            }
        }

        return null;
    }
})();
