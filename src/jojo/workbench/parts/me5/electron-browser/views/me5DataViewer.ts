import { addDisposableEventListener } from 'jojo/base/browser/dom';
import { Input } from 'jojo/base/browser/ui/input';
import { Label } from 'jojo/base/browser/ui/labels';
import { KeyCode } from 'jojo/base/common/keyCodes';
import { dispose } from 'jojo/base/common/lifecycle';
import {
  ContextMenuEvent,
  IDataController,
  IDataRenderer,
  IDataSource,
  ITree,
} from 'jojo/base/parts/tree/browser/tree';
import { Menu } from 'jojo/platform/actions/common/menu';
import { MenuId } from 'jojo/platform/actions/common/registry';
import { IContextKey, IContextKeyService, RawContextKey } from 'jojo/platform/contexts/common/contextKey';
import { Me5Item, Me5ItemState } from 'jojo/workbench/parts/me5/me5Data';
import { IBinaryFileService } from 'jojo/workbench/services/binaryfile/binaryFiles';
import { BinaryFileService } from 'jojo/workbench/services/binaryfile/binaryFileService';
import { ContextMenuService, IContextMenuService } from 'jojo/workbench/services/contextmenu/contextmenuService';
import { IWorkbenchEditorService, WorkbenchEditorService } from 'jojo/workbench/services/editor/editorService';

export const explorerEditableItemId = 'explorerRename';
export const explorerEditContext = new RawContextKey<boolean>(explorerEditableItemId, false);

export class Me5DataSource implements IDataSource {
  public getId(element: Me5Item): string {
    return element.getId();
  }

  public getChildren(element: Me5Item): Me5Item[] {
    if (!element || !element.getChildren) {
      return [];
    }

    return element.getChildren();
  }

  public hasChildren(element: Me5Item): boolean {
    if (!element) {
      return false;
    }

    return element.isGroup;
  }
}

export interface IMe5TemplateData {
  container: HTMLElement;
  label: Label;
}

export class Me5DataRenderer implements IDataRenderer {
  public static ITEM_HEIGHT = 22;

  private editContext: IContextKey<boolean>;

  constructor(@IContextKeyService contextKeyService: IContextKeyService) {
    this.editContext = explorerEditContext.bindTo(contextKeyService);
  }

  public renderTemplate(container: HTMLElement): IMe5TemplateData {
    const label = new Label(container);
    return { label, container };
  }

  public render(tree: ITree, element: Me5Item, templateData: IMe5TemplateData) {
    if (element.state === Me5ItemState.Edit) {
      templateData.label.element.style.display = 'none';
      this.renderInput(tree, templateData.container, element);
      this.editContext.set(true);
    } else {
      templateData.label.element.style.display = 'flex';
      templateData.label.setValue(element.name);
    }
  }

  private renderInput(tree: ITree, container: HTMLElement, element: Me5Item) {
    const label = new Label(container);
    const input = new Input(label.element);

    input.value = element.name;
    input.focus();

    const done = (commit: boolean) => {
      tree.clearHighlight();
      element.state = Me5ItemState.Normal;

      if (commit) {
        element.name = input.value;
      }

      dispose(toDispose);
      container.removeChild(label.element);

      this.editContext.set(false);

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
        done(true);
      }),
    ];
  }

  public getHeight(): number {
    return Me5DataRenderer.ITEM_HEIGHT;
  }
}

export class Me5DataController implements IDataController {
  private contextMenu: Menu;

  constructor(
    @IWorkbenchEditorService private editorService: WorkbenchEditorService,
    @IContextMenuService private contextMenuService: ContextMenuService,
    @IBinaryFileService private binaryFileService: BinaryFileService
  ) {}

  public onClick(tree: ITree, element: Me5Item) {
    tree.focus();

    const input = this.editorService.getActiveEditorInput();
    const model = this.binaryFileService.models.get(input.getResource());
    model.setDataIndex(element.index);
    this.editorService.refresh();
  }

  public onContextMenu(tree: ITree, element: Me5Item, event: ContextMenuEvent) {
    event.preventDefault();
    event.stopPropagation();

    tree.focus();
    tree.setFocus(element);

    if (!this.contextMenu) {
      this.contextMenu = new Menu(MenuId.Me5ExplorerTreeContext);
    }

    this.contextMenuService.showContextMenu({
      getAnchor: () => {
        return {
          x: event.posx,
          y: event.posy,
        };
      },
      getItems: () => {
        return this.contextMenu.getItems();
      },
    });
  }
}
