import { ContextMenuEvent } from '../../../../platform/events/contextMenuEvent';
import { RelayEvent } from '../../../common/event';
import { IFocusEvent } from './treeModel';

export interface ITree {
  onDidChangeFocus: RelayEvent<IFocusEvent>;

  layout(): void;

  setRoot(element: any): Promise<any>;
  getRoot(): any;

  focus(): void;
  isDOMFocused(): boolean;

  refresh(element: any, skipRenderChildren?: boolean): Promise<any>;

  expand(element: any): Promise<any>;
  expandAll(elements: any[]): Promise<any>;

  getExpandedElements(): any[];

  setHighlight(element: any): void;
  clearHighlight(): void;

  setSelection(elements: any[]): void;
  getSelection(): any[];

  setFocus(element?: any): void;
  getFocus(): any;

  // dispose(): void;
}

export interface ITreeConfiguration {
  dataSource: IDataSource;
  renderer: IDataRenderer;
  controller: IDataController;
}

export interface ITreeContext extends ITreeConfiguration {
  tree: ITree;
  options: ITreeOptions;
}

export interface IDataSource {
  getId(element: any): string;
  getChildren(element: any): any[];
  hasChildren(element: any): boolean;
}

export interface IDataRenderer {
  renderTemplate(container: HTMLElement): any;
  render(tree: ITree, element: any, templateData: any): void;
  getHeight(): number;
}

export interface IDataController {
  onClick(tree: ITree, element: any);
  onContextMenu(tree: ITree, element: any, event: ContextMenuEvent);
}

export interface ITreeOptions {
  indentPixels?: number;
}
