import { IMe5Data, Me5Group, Me5Item } from 'code/editor/workbench/parts/me5ItemModel';
import { IEditorService, EditorPart } from 'code/editor/workbench/browser/parts/editor/editorPart';
import { ContextMenuEvent } from 'code/base/parts/tree/browser/tree';
import { IContextMenuService, ContextMenuService } from 'code/editor/workbench/services/contextmenuService';
import { Menu } from '../../../platform/actions/menu';
import { MenuId } from '../../../platform/actions/registry';

export interface IDataSource {
    getId(element: any): string;
    getChildren(element: any): any[];
    hasChildren(element: any): boolean;
}

export interface IDataRenderer {
    render(container: HTMLElement, element: any): void;
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

export class Me5DataRenderer implements IDataRenderer {
    public render(container: HTMLElement, element: IMe5Data) {
        if (container) {
            const labelContainer = document.createElement('div');
            labelContainer.className = 'label';
            labelContainer.title = element.getName();

            const labelContent = document.createElement('div');
            labelContent.className = 'label-description';
            labelContent.innerHTML = element.getName();

            labelContainer.appendChild(labelContent);
            if (container.firstChild) {
                container.removeChild(container.firstChild);
            }
            container.appendChild(labelContainer);
        }
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