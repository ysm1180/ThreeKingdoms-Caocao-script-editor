import { addDisposableEventListener } from '../../base/browser/dom';
import { Input } from '../../base/browser/ui/input';
import { Label } from '../../base/browser/ui/labels';
import { KeyCode } from '../../base/common/keyCodes';
import { dispose } from '../../base/common/lifecycle';
import { IDataController, IDataRenderer, IDataSource, Tree } from '../../base/parts/tree/browser/tree';
import { Menu } from '../../platform/actions/menu';
import { MenuId } from '../../platform/actions/registry';
import { RawContextKey } from '../../platform/contexts/contextKey';
import { ContextKey, ContextKeyService, IContextKeyService } from '../../platform/contexts/contextKeyService';
import { ContextMenuEvent } from '../../platform/events/contextMenuEvent';
import { ContextMenuService, IContextMenuService } from '../services/contextmenuService';
import { IWorkbenchEditorService, WorkbenchEditorService } from '../services/editor/editorService';
import { IResourceFileService } from '../services/resourceFile/resourcefiles';
import { ResourceFileService } from '../services/resourceFile/resourceFileService';
import { ItemState, Me5Stat } from './files/me5Data';

export const explorerEditableItemId = 'explorerRename';
export const explorerEditContext = new RawContextKey<boolean>(explorerEditableItemId, false);

export class Me5DataSource implements IDataSource {
  public getId(element: Me5Stat): string {
    return element.getId();
  }

  public getChildren(element: Me5Stat): Me5Stat[] {
    if (!element || !element.getChildren) {
      return [];
    }

    return element.getChildren();
  }

  public hasChildren(element: Me5Stat): boolean {
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

  private editContext: ContextKey<boolean>;

  constructor(@IContextKeyService contextKeyService: ContextKeyService) {
    this.editContext = explorerEditContext.bindTo(contextKeyService);
  }

  public renderTemplate(container: HTMLElement): IMe5TemplateData {
    const label = new Label(container);
    return { label, container };
  }

  public render(tree: Tree, element: Me5Stat, templateData: IMe5TemplateData) {
    if (element.state === ItemState.Edit) {
      templateData.label.element.style.display = 'none';
      this.renderInput(tree, templateData.container, element);
      this.editContext.set(true);
    } else {
      templateData.label.element.style.display = 'flex';
      templateData.label.setValue(element.name);
    }
  }

  private renderInput(tree: Tree, container: HTMLElement, element: Me5Stat) {
    const label = new Label(container);
    const input = new Input(label.element);

    input.value = element.name;
    input.focus();

    const done = (commit: boolean) => {
      tree.clearHighlight();
      element.state = ItemState.Normal;

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
    @IResourceFileService private resourceFileService: ResourceFileService
  ) {}

  public onClick(tree: Tree, element: Me5Stat) {
    tree.focus();

    const input = this.editorService.getActiveEditorInput();
    const model = this.resourceFileService.models.get(input.getResource());
    model.setDataIndex(element.index);
    this.editorService.refresh();
  }

  public onContextMenu(tree: Tree, element: Me5Stat, event: ContextMenuEvent) {
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
