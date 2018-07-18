import { DomBuilder, $ } from '../../../../../base/browser/domBuilder';
import { Event } from '../../../../../base/common/event';
import { IEditorInput, IEditorEvent } from '../../../../../platform/editor/editor';
import { Part } from '../../part';
import { Editors } from './editors';
import { BaseEditor } from './baseEditor';
import { decorator, ServiceIdentifier } from '../../../../../platform/instantiation/instantiation';
import { IInstantiationService, InstantiationService } from '../../../../../platform/instantiation/instantiationService';
import { EditorRegistry, EditorDescriptor } from '../../editor';

export const IEditorService: ServiceIdentifier<EditorPart> = decorator<EditorPart>('editorPart');

export class EditorPart extends Part {
    private editorContainer: DomBuilder;

    private editors: Editors;
    private currentEditor: BaseEditor;

    public onEditorChanged = new Event<void>();
    public onEditorInputChanged = new Event<IEditorEvent>();
    public onEditorClosed = new Event<IEditorEvent>();

    constructor(
        @IInstantiationService private instantiationService: InstantiationService,
    ) {
        super();

        this.editors = new Editors();
        this.currentEditor = null;
    }

    public getEditors() {
        return this.editors;
    }

    public create(parent: DomBuilder) {
        super.create(parent);

        this.editorContainer = $(this.getContentArea()).div({
            class: 'editor-container'
        });
    }

    public layout(width: number, height: number) {
        super.layout(width, height);

        this.editorContainer.size(width, height);
    }

    public openEditor(input: IEditorInput) {
        if (!input) {
            return;
        }

        const isChanged = !this.editors.isActive(input);

        this.editors.openEditor(input);

        const editor = this.doShowEditor(input);
        if (!editor) {
            return;
        }
        this.doSetInput(input, editor);
        this.currentEditor = editor;

        if (isChanged) {
            this.onEditorChanged.fire();
        }
    }

    private doSetInput(input: IEditorInput, editor: BaseEditor) {
        editor.setInput(input).then(() => {
            const eventData : IEditorEvent = {
                editor: input,
            };
            this.onEditorInputChanged.fire(eventData);    
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

        return editor;
    }

    private doCreateViewEditor(desc: EditorDescriptor): BaseEditor {
        if (this.currentEditor && desc.describes(this.currentEditor)) {
            return this.currentEditor;
        }

        let editor: BaseEditor = desc.instantiation(this.instantiationService);

        if (!editor.getContainer()) {
            editor.create(this.editorContainer);
        }

        return editor;
    }

    private doHideEditor(editor: BaseEditor) {
        editor.dispose();

        this.currentEditor = null;
    }

    public closeEditor(input: IEditorInput) {
        if (this.editors.isActive(input)) {
            this.doCloseActiveEditor();
        } else {
            this.doCloseInactiveEditor(input);
        }

        const closeEventData: IEditorEvent = {
            editor: input
        };
        this.onEditorClosed.fire(closeEventData);
    }

    private doCloseActiveEditor() {
        this.editors.closeEditor(this.editors.activeEditor);

        if (this.editors.count > 0) {
            this.openEditor(this.editors.activeEditor);
        }
    }

    private doCloseInactiveEditor(input: IEditorInput) {
        this.editors.closeEditor(input, false);
    }

    public getActiveEditorInput(): IEditorInput {
        return this.editors.activeEditor;
    }
}