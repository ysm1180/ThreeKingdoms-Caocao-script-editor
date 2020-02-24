import { IMouseEvent } from 'jojo/base/browser/mouseEvent';
import { RelayEvent } from 'jojo/base/common/event';
import { IFocusEvent } from 'jojo/base/parts/tree/browser/treeModel';

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

export abstract class ContextMenuEvent {
  private _posx: number;
  private _posy: number;
  private _target: HTMLElement;

  constructor(posx: number, posy: number, target: HTMLElement) {
    this._posx = posx;
    this._posy = posy;
    this._target = target;
  }

  public preventDefault(): void {
    // no-op
  }

  public stopPropagation(): void {
    // no-op
  }

  public get posx(): number {
    return this._posx;
  }

  public get posy(): number {
    return this._posy;
  }

  public get target(): HTMLElement {
    return this._target;
  }
}

export class MouseContextMenuEvent extends ContextMenuEvent {
  private originalEvent: IMouseEvent;

  constructor(e: IMouseEvent) {
    super(e.posx, e.posy, e.target);
    this.originalEvent = e;
  }

  public preventDefault(): void {
    this.originalEvent.preventDefault();
  }

  public stopPropagation(): void {
    this.originalEvent.stopPropagation();
  }
}
