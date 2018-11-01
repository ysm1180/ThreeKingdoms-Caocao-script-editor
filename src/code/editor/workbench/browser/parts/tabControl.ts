import * as Dom from '../../../../base/browser/dom';
import { IDisposable, combinedDisposable } from '../../../../base/common/lifecycle';
import { EditorGroup } from './editor/editorGroup';
import { EditorPart, IEditorGroupService } from './editor/editorPart';

export class TabControl {
    private parent: HTMLElement;
    private container: HTMLElement;
    private context: EditorGroup;

    private labels: HTMLElement[];

    private toDispose: IDisposable[];

    constructor(
        @IEditorGroupService private editorService: EditorPart
    ) {
        this.labels = [];
        
        this.toDispose = [];
    }

    public create(parent: HTMLElement): void {
        this.parent = parent;

        this.container = document.createElement('div');
        this.container.className = 'tabs-container';
        this.parent.appendChild(this.container);
    }

    public setContext(context: EditorGroup) {
        this.context = context;
    }

    public refresh() {
        const count = this.context.count;

        this.handleTabs(count);
        this.update();
    }

    private handleTabs(tabsNeeds: number) {
        const tabCount = this.container.children.length;

        if (tabCount === tabsNeeds) {
            return;
        }

        if (tabCount < tabsNeeds) {
            for (let i = tabCount; i < tabsNeeds; i++) {
                this.container.appendChild(this.createTab(i));
            }
        } else {
            for (let i = 0; i < tabCount - tabsNeeds; i++) {
                (this.container.lastChild as HTMLElement).remove();
                this.labels.pop();
            }
        }
    }

    private createTab(index: number): HTMLElement {
        const toDispose = [];

        const tabContainer = document.createElement('div');
        tabContainer.className = 'tab';

        toDispose.push(Dom.addDisposableEventListener(tabContainer, 'mousedown', (e) => {
            if (e.button === 0) {
                const editor = this.context.getEditor(index);
                this.editorService.openEditor(editor);
            }
        }));

        const label = document.createElement('div');
        label.className = 'tab-label';
        tabContainer.appendChild(label);
        this.labels.push(label);

        const tabCloseContainer = document.createElement('div');
        tabCloseContainer.className = 'tab-close';
        tabContainer.appendChild(tabCloseContainer);

        const iconContainer = document.createElement('div');
        iconContainer.className = 'icon-container';
        tabCloseContainer.appendChild(iconContainer);

        const closeIcon = document.createElement('a');
        closeIcon.className = 'close-icon';
        closeIcon.setAttribute('title', '닫기');
        toDispose.push(Dom.addDisposableEventListener(closeIcon, 'mousedown', (e) => {
            if (e.button === 0) {
                e.preventDefault();
                e.stopPropagation();

                const editor = this.context.getEditor(index);
                this.editorService.closeEditor(editor);
            }
        }));
        iconContainer.appendChild(closeIcon);

        this.toDispose.push(combinedDisposable(toDispose));

        return tabContainer;
    }

    private update() {
        const editors = this.context;
        const editorInputs = this.context.getEditors();

        editorInputs.forEach((editor, index) => {
            const tabContainer = this.container.children[index] as HTMLElement;
            if (!tabContainer) {
                return;
            }

            const isTabActive = editors.isActive(editor);

            const name = editor.getName();
            this.labels[index].innerHTML = name;

            if (isTabActive) {
                Dom.addClass(tabContainer, 'active');
            } else {
                Dom.removeClass(tabContainer, 'active');
            }
        });

    }
}