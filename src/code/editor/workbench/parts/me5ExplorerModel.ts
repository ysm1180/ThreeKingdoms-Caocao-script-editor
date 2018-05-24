import { Label } from 'code/base/browser/ui/labels';
import { Input } from 'code/base/browser/ui/input';
import { addDisposableEventListener } from 'code/base/browser/dom';
import { dispose } from 'code/base/common/lifecycle';
import { KeyCode } from 'code/base/common/keyCodes';
import { ContextMenuEvent, Tree } from 'code/base/parts/tree/browser/tree';
import { Menu } from 'code/platform/actions/menu';
import { MenuId } from 'code/platform/actions/registry';
import { IInstantiationService, InstantiationService } from 'code/platform/instantiation/instantiationService';
import { IMe5Data, Me5Group, Me5Item } from 'code/editor/workbench/parts/me5ItemModel';
import { IEditorService, EditorPart } from 'code/editor/workbench/browser/parts/editor/editorPart';
import { IContextMenuService, ContextMenuService } from 'code/editor/workbench/services/contextmenuService';

export interface IDataSource {
    getId(element: any): string;
    getChildren(element: any): any[];
    hasChildren(element: any): boolean;
}

export interface IDataRenderer {
    renderTemplate(container: HTMLElement): any;
    render(tree: Tree, element: any, templateData: IMe5TemplateData): void;
}

export interface IDataController {
    onClick(element: any);
    onContextMenu(element: any, event: ContextMenuEvent);
}

export class Me5DataSource implements IDataSource {
    public getId(element: IMe5Data): string {
        return element.getId();
    }

    public getChildren(element: IMe5Data): Me5Group[] | Me5Item[] {
        return element.getChildren();
    }

    public hasChildren(element: IMe5Data): boolean {
        return element.hasChildren();
    }
}

export interface IMe5TemplateData {
    container: HTMLElement;
    label: Label;
}

export class Me5DataRenderer implements IDataRenderer {
    constructor(
        @IInstantiationService private instantiationService: InstantiationService,

    ) {

    }

    public renderTemplate(container: HTMLElement): IMe5TemplateData {
        const label = this.instantiationService.create(Label, container);
        return { label, container };
    }

    public render(tree: Tree, element: IMe5Data, templateData: IMe5TemplateData) {
        if (element.isEditable()) {
            templateData.label.element.style.display = 'none';
            this.renderInput(tree, templateData.container, element);
        } else {
            templateData.label.element.style.display = 'flex';
            templateData.label.setValue(element.getName());
        }
    }

    private renderInput(tree: Tree, container: HTMLElement, element: IMe5Data) {
        const label = this.instantiationService.create(Label, container);
        const input = new Input(label.element);

        input.value = element.getName();
        input.focus();

        const done = (commit: boolean) => {
            element.setEditable(false);

            if (commit) {
                element.setName(input.value);
            }

            dispose(toDispose);
            container.removeChild(label.element);

            tree.refresh(element, true);
        };

        const toDispose = [
            addDisposableEventListener(input.inputElement, 'keydown', (e: KeyboardEvent) => {
                if (e.keyCode === KeyCode.Enter) {
                    done(true);
                } else if (e.keyCode === KeyCode.Escape) {
                    done(false);
                }
            }),

            addDisposableEventListener(input.inputElement, 'blur', () => {
                setTimeout(() => {
                    tree.focus();
                }, 0);
                done(false);
            }),
        ];
    }
}

export class Me5DataController implements IDataController {
    private contextMenu: Menu;

    constructor(
        @IEditorService private editorService: EditorPart,
        @IContextMenuService private contextMenuService: ContextMenuService
    ) {

    }

    public onClick(element: any) {
        if (element instanceof Me5Item) {
            this.editorService.setInput(element);
        }
    }

    public onContextMenu(element: Me5Group | Me5Item, event: ContextMenuEvent) {
        event.preventDefault();
        event.stopPropagation();

        if (!this.contextMenu) {
            this.contextMenu = new Menu(MenuId.Me5ExplorerContext);
        }

        this.contextMenuService.showContextMenu({
            getAnchor: () => {
                return {
                    x: event.posx,
                    y: event.posy
                };
            },
            getItems: () => {
                return this.contextMenu.getItems();
            }
        });
    }
}