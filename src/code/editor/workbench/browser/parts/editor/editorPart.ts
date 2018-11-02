import { DomBuilder, $ } from '../../../../../base/browser/domBuilder';
import { Event } from '../../../../../base/common/event';
import { IEditorInput } from '../../../../../platform/editor/editor';
import { Part } from '../../part';
import { EditorGroup } from './editorGroup';
import { BaseEditor } from './baseEditor';
import { decorator, ServiceIdentifier } from '../../../../../platform/instantiation/instantiation';
import { IInstantiationService } from '../../../../../platform/instantiation/instantiationService';
import { EditorRegistry, EditorDescriptor } from '../../editor';
import { IDimension } from '../../../../common/editorCommon';
import { RawContextKey } from '../../../../../platform/contexts/contextKey';
import { IContextKeyService, ContextKeyService, ContextKey } from '../../../../../platform/contexts/contextKeyService';

export const editorInputIsActivatedId = 'editorInputIsactivatedId';
export const editorInputActivatedContext = new RawContextKey<boolean>(editorInputIsActivatedId, false);

export const IEditorGroupService: ServiceIdentifier<EditorPart> = decorator<EditorPart>('editorPart');

export class EditorPart extends Part {
    private editorGroup: EditorGroup;
    private currentEditor: BaseEditor;

    private instantiatedEditors: BaseEditor[];

    private editorActivatedContext: ContextKey<boolean>;

    public onEditorInputChanged = new Event<IEditorInput>();
    public onEditorChanged = new Event<void>();

    constructor(
        @IContextKeyService contextKeyService: ContextKeyService,
        @IInstantiationService private instantiationService: IInstantiationService,
    ) {
        super();

        this.editorGroup = this._createGroup();
        this.currentEditor = null;
        this.instantiatedEditors = [];

        this.editorActivatedContext = editorInputActivatedContext.bindTo(contextKeyService);
    }

    private _createGroup(): EditorGroup {
        const group: EditorGroup = this.instantiationService.create(EditorGroup);

        this.registerDispose(group.onEditorStructureChanged.add(e => this.onEditorChanged.fire()));
        this.registerDispose(group.onEditorStateChanged.add(e => this.onEditorChanged.fire()));

        return group;
    }

    public getEditorGroup() {
        return this.editorGroup;
    }

    public getActiveEditorInput(): IEditorInput {
        return this.editorGroup.activeEditorInput;
    }

    public create(parent: DomBuilder) {
        super.create(parent);
    }

    public layout(size: IDimension) {
        super.layout(size);

        if (this.currentEditor) {
            this.currentEditor.layout(size);
        }
    }

    public openEditors(inputs: IEditorInput[]) {
        const promises = [];
        for (let i = 0; i < inputs.length; i++) {
            promises.push(this.openEditor(inputs[i]));
        }

        return Promise.all(promises);
    }

    public openEditor(input: IEditorInput): Promise<void> {
        if (!input) {
            return Promise.resolve(null);
        }

        const isNewOpen = this.editorGroup.openEditor(input);

        const editor = this.doShowEditor(input);
        if (!editor) {
            return Promise.resolve(null);
        }

        this.editorActivatedContext.set(true);

        return this.setInput(input, editor, isNewOpen);
    }

    public setInput(input: IEditorInput, editor: BaseEditor, forceOpen: boolean = false): Promise<void> {
        const previousInput = editor.getInput();
        const inputChanged = (!previousInput || !previousInput.matches(input) || forceOpen);

        return editor.setInput(input, forceOpen).then(() => {
            if (inputChanged) {
                this.onEditorInputChanged.fire(input);
            }
        });
    }

    private doShowEditor(input: IEditorInput): BaseEditor {
        const desc = EditorRegistry.getEditor(input);
        if (!desc) {
            return null;
        }

        if (this.currentEditor) {
            this.doHideEditor(this.currentEditor);
        }

        const editor = this.doCreateViewEditor(desc);

        editor.getContainer().build(this.getContentArea());
        editor.getContainer().show();
        editor.layout();

        this.currentEditor = editor;

        return editor;
    }

    private doCreateViewEditor(desc: EditorDescriptor): BaseEditor {
        if (this.currentEditor && desc.describes(this.currentEditor)) {
            return this.currentEditor;
        }

        const editor = this.doInstantiateEditor(desc);

        if (!editor.getContainer()) {
            editor.create($().div({
                class: 'editor-container',
                id: desc.getId(),
            }));
        }

        return editor;
    }

    private doInstantiateEditor(desc: EditorDescriptor): BaseEditor {
        const instantiatedEditor = this.instantiatedEditors.filter(e => desc.describes(e))[0];
        if (instantiatedEditor) {
            return instantiatedEditor;
        }

        const editor = desc.instantiation(this.instantiationService);

        this.instantiatedEditors.push(editor);

        return editor;
    }

    private doHideEditor(editor: BaseEditor) {
        editor.getContainer().offDOM().hide();

        this.currentEditor = null;
    }

    private doCloseEditor() {
        if (this.currentEditor) {
            this.doHideEditor(this.currentEditor);
        }

        this.editorActivatedContext.set(false);

        this.currentEditor = null;
    }

    public closeEditor(input: IEditorInput) {
        if (this.editorGroup.isActive(input)) {
            this.doCloseActiveEditor();
        } else {
            this.doCloseInactiveEditor(input);
        }
    }

    private doCloseActiveEditor() {
        this.editorGroup.closeEditor(this.editorGroup.activeEditorInput);

        if (this.editorGroup.count > 0) {
            this.openEditor(this.editorGroup.activeEditorInput);
        } else {
            this.doCloseEditor();
        }
    }

    private doCloseInactiveEditor(input: IEditorInput) {
        this.editorGroup.closeEditor(input, false);
    }

    public getCurrentEditor() {
        return this.currentEditor;
    }
}