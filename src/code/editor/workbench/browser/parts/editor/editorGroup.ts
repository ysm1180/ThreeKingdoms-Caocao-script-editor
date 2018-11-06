import { Event } from '../../../../../base/common/event';
import { EditorInput } from '../../../common/editor';
import { IDisposable, dispose } from '../../../../../base/common/lifecycle';

export class EditorGroup {
    private editors: EditorInput[];

    private active: EditorInput;

    public onEditorStructureChanged = new Event<EditorInput>();
    public onEditorStateChanged = new Event<EditorInput>();
    public onEditorOpened = new Event<EditorInput>();
    public onEditorClosed = new Event<EditorInput>();
    public onEditorActivated = new Event<EditorInput>();
    public onEditorSaving = new Event<EditorInput>();
    public onEditorSaved = new Event<EditorInput>();

    constructor() {
        this.editors = [];
    }

    public get activeEditorInput() {
        return this.active;
    }

    public get count() {
        return this.editors.length;
    }

    public getEditor(index: number): EditorInput {
        if (index >= this.editors.length) {
            return null;
        }

        return this.editors[index];
    }

    public getEditors(): EditorInput[] {
        return this.editors.slice(0);
    }

    public indexOf(editor: EditorInput): number {
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

    public openEditor(editor: EditorInput) {
        let isNew = false;

        const index = this.indexOf(editor);
        if (index === -1) {
            isNew = true;
            this.editors.push(editor);

            this._hookEditorListeners(editor);

            this.fireEvent(this.onEditorOpened, editor, true);
        }

        this.setActive(editor);

        return isNew;
    }

    private _hookEditorListeners(editor: EditorInput): void {
        const unbind: IDisposable[] = [];

        unbind.push(editor.onChangedState.add(() => {
            this.fireEvent(this.onEditorStateChanged, editor, false);
        }));

        unbind.push(this.onEditorClosed.add(e => {
            if (e.matches(editor)) {
                dispose(unbind);
            }
        }));
    }

    public closeEditor(editor: EditorInput, openNext = true) {
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

        this.fireEvent(this.onEditorClosed, editor, true);
    }

    private setActive(editor: EditorInput) {
        const index = this.indexOf(editor);
        if (index === -1) {
            return;
        }

        if (this.matches(this.active, editor)) {
            return;
        }

        this.active = editor;

        this.fireEvent(this.onEditorActivated, editor, false);
    }

    private fireEvent(event: Event<EditorInput>, editor: EditorInput, isStructure: boolean) {
        event.fire(editor);
        if (isStructure) {
            this.onEditorStructureChanged.fire(editor);
        } else {
            this.onEditorStateChanged.fire(editor);
        }
    }

    public isActive(editor: EditorInput): boolean {
        return this.active && this.matches(this.active, editor);
    }

    public matches(editorA: EditorInput, editorB: EditorInput): boolean {
        return !!editorA && !!editorB && editorA.matches(editorB);
    }
}