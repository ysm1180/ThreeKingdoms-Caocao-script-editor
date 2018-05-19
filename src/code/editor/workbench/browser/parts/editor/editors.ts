import { IEditorInput } from 'code/platform/editor/editor';

export class Editors {
    private editors: IEditorInput[];

    private active: IEditorInput;

    constructor() {
        this.editors = [];
    }

    public get activeEditor() {
        return this.active;
    }

    public get count() {
        return this.editors.length;
    }

    public getEditor(index: number): IEditorInput {
        if (index >= this.editors.length) {
            return null;
        }

        return this.editors[index];
    }

    public getEditors(): IEditorInput[] {
        return this.editors.slice(0);
    }

    public indexOf(editor: IEditorInput): number {
        if (!editor) {
            return -1;
        }

        for (let i = 0; i < this.editors.length; i++) {
            if (this.matches(this.editors[i], editor)) {
                return i;
            }
        }

        return -1;
    }

    public openEditor(editor: IEditorInput) {
        const index = this.indexOf(editor);
        if (index === -1) {
            this.editors.push(editor);
        } else {
        }

        this.setActive(editor);
    }

    public closeEditor(editor: IEditorInput, openNext = true) {
        const index = this.indexOf(editor);
        if (index === -1) {
            return;
        }

        if (openNext && this.matches(this.active, editor)) {
            if (this.editors.length > 1) {
                if (index === this.editors.length - 1) {
                    this.setActive(this.editors[index - 1]);
                } else {
                    this.setActive(this.editors[index + 1]);
                }
            } else {
                this.active = null;
            }
        }

        this.editors.splice(index, 1);
    }

    private setActive(editor: IEditorInput) {
        const index = this.indexOf(editor);
        if (index === -1) {
            return;
        }

        this.active = editor;
    }

    public isActive(editor: IEditorInput): boolean {
        return this.active && this.matches(this.active, editor);
    }

    public matches(editorA: IEditorInput, editorB: IEditorInput): boolean {
        return !!editorA && !!editorB && editorA.matches(editorB);
    }
}