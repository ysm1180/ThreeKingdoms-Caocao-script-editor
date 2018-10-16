import { DomBuilder, $ } from '../../../../../base/browser/domBuilder';
import { Event } from '../../../../../base/common/event';
import { IEditorInput, IEditorEvent } from '../../../../../platform/editor/editor';
import { Part } from '../../part';
import { EditorGroup } from './editors';
import { BaseEditor } from './baseEditor';
import { decorator, ServiceIdentifier } from '../../../../../platform/instantiation/instantiation';
import { IInstantiationService } from '../../../../../platform/instantiation/instantiationService';
import { EditorRegistry, EditorDescriptor } from '../../editor';

export const IEditorService: ServiceIdentifier<EditorPart> = decorator<EditorPart>('editorPart');

export class EditorPart extends Part {
    private editorGroup: EditorGroup;
    private currentEditor: BaseEditor;

    private instantiatedEditors: BaseEditor[];

    public onEditorInputChanged = new Event<IEditorEvent>();

    constructor(
        @IInstantiationService private instantiationService: IInstantiationService,
    ) {
        super();

        this.editorGroup = this.instantiationService.create(EditorGroup);
        this.currentEditor = null;
        this.instantiatedEditors = [];
    }

    public getEditorGroup() {
        return this.editorGroup;
    }

    public create(parent: DomBuilder) {
        super.create(parent);
    }

    public layout(width: number, height: number) {
        super.layout(width, height);

        if (this.currentEditor) {
            this.currentEditor.layout({
                width: width,
                height: height,
            });
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

        this.editorGroup.openEditor(input);

        const editor = this.doShowEditor(input);
        if (!editor) {
            return Promise.resolve(null);
        }

        return this.doSetInput(input, editor);
    }

    private doSetInput(input: IEditorInput, editor: BaseEditor) {
        return editor.setInput(input).then(() => {
            const eventData: IEditorEvent = {
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
        
        editor.getContainer().build(this.getContentArea());
        editor.getContainer().show();

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

    private doCloseEditor(editor: BaseEditor) {
        editor.dispose();

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
        this.editorGroup.closeEditor(this.editorGroup.activeEditor);

        if (this.editorGroup.count > 0) {
            this.openEditor(this.editorGroup.activeEditor);
        } else {
            this.doCloseEditor(this.currentEditor);
        }
    }

    private doCloseInactiveEditor(input: IEditorInput) {
        this.editorGroup.closeEditor(input, false);
    }
}