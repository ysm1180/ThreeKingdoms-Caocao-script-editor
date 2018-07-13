import { BaseEditor } from './parts/editor/baseEditor';
import { InstantiationService } from '../../../platform/instantiation/instantiationService';
import { IEditorInput } from '../../../platform/editor/editor';
import { ClassDescriptor } from '../../../platform/instantiation/descriptor';
import { isArray } from '../../../base/common/types';

export class EditorInputDescriptor {
	private ctor: new (...args: any[]) => IEditorInput;

	constructor(ctor: new (...args: any[]) => IEditorInput) {
		this.ctor = ctor;
	}

	public instantiation(instantiationService: InstantiationService, resource: string) {
		return instantiationService.create(this.ctor, resource);
	}
}


export class EditorDescriptor {
	private ctor: new (...args: any[]) => BaseEditor;
	private id: string;

	constructor(ctor: new (...args: any[]) => BaseEditor, id: string) {
		this.ctor = ctor;
		this.id = id;
	}

	public getId(): string {
		return this.id;
	}

	public instantiation(instantiationService: InstantiationService) {
		return instantiationService.create(this.ctor);
	}

	public describes(obj: any): boolean {
		return obj instanceof BaseEditor && (<BaseEditor>obj).getId() === this.id;
	}
}

export const Extensions = {
	ME5: '.me5',

};

export const EditorInputRegistry = new class {
	private inputs: { [extension: string]: EditorInputDescriptor };

	constructor() {
		this.inputs = {};
	}

	public registerEditor(extension: string, editorInputDescriptor: EditorInputDescriptor): void {
		this.inputs[extension] = editorInputDescriptor;
	}

	public getEditorInput(extension: string): EditorInputDescriptor {
		return this.inputs[extension];
	}

};


const INPUT_DESCRIPTORS_PROPERTY = '__$inputDescriptors';

export const EditorRegistry = new class {
	private editors: EditorDescriptor[];

	constructor() {
		this.editors = [];
	}

	public registerEditor(descriptor: EditorDescriptor, editorInputDescriptor: ClassDescriptor<IEditorInput>): void;
	public registerEditor(descriptor: EditorDescriptor, editorInputDescriptor: ClassDescriptor<IEditorInput>[]): void;
	public registerEditor(descriptor: EditorDescriptor, editorInputDescriptor: any): void {
		let inputDescriptors: ClassDescriptor<IEditorInput>[] = [];
		if (!isArray(editorInputDescriptor)) {
			inputDescriptors.push(editorInputDescriptor);
		} else {
			inputDescriptors = editorInputDescriptor;
		}

		descriptor[INPUT_DESCRIPTORS_PROPERTY] = inputDescriptors;
		this.editors.push(descriptor);
	}

	public getEditor(input: IEditorInput): EditorDescriptor {
		const findEditorDescriptors = (input: IEditorInput, byInstanceOf?: boolean): EditorDescriptor[] => {
			const matchingDescriptors: EditorDescriptor[] = [];

			for (let i = 0; i < this.editors.length; i++) {
				const editor = this.editors[i];
				const inputDescriptors = <ClassDescriptor<IEditorInput>[]>editor[INPUT_DESCRIPTORS_PROPERTY];
				for (let j = 0; j < inputDescriptors.length; j++) {
					const inputClass = inputDescriptors[j].ctor;

					// Direct check on constructor type (ignores prototype chain)
					if (!byInstanceOf && input.constructor === inputClass) {
						matchingDescriptors.push(editor);
						break;
					}

					// Normal instanceof check
					else if (byInstanceOf && input instanceof inputClass) {
						matchingDescriptors.push(editor);
						break;
					}
				}
			}

			// If no descriptors found, continue search using instanceof and prototype chain
			if (!byInstanceOf && matchingDescriptors.length === 0) {
				return findEditorDescriptors(input, true);
			}

			if (byInstanceOf) {
				return matchingDescriptors;
			}

			return matchingDescriptors;
		};

		const descriptors = findEditorDescriptors(input);
		if (descriptors && descriptors.length > 0) {
			// Ask the input for its preferred Editor
			const preferredEditorId = input.getPreferredEditorId();
			if (preferredEditorId) {
				return this.getEditorById(preferredEditorId);
			}

			// Otherwise, first come first serve
			return descriptors[0];
		}

		return null;
	}

	public getEditorById(editorId: string): EditorDescriptor {
		for (let i = 0; i < this.editors.length; i++) {
			const editor = this.editors[i];
			if (editor.getId() === editorId) {
				return editor;
			}
		}

		return null;
	}
};
