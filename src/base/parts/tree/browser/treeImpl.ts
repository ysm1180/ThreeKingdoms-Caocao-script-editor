import { RelayEvent } from '../../../common/event';
import { IDataController, IDataRenderer, IDataSource, ITree, ITreeConfiguration, ITreeOptions } from './tree';
import { IFocusEvent, TreeModel } from './treeModel';
import { TreeView } from './treeView';

export class TreeContext {
  public readonly tree: ITree;
  public readonly dataSource: IDataSource;
  public readonly renderer: IDataRenderer;
  public readonly controller: IDataController;
  public readonly options: ITreeOptions;

  constructor(tree: ITree, configuration: ITreeConfiguration, options: ITreeOptions) {
    this.tree = tree;
    this.dataSource = configuration.dataSource;
    this.renderer = configuration.renderer;
    this.controller = configuration.controller;
    this.options = options;
  }
}

export class Tree implements ITree {
  private container: HTMLElement;

  private context: TreeContext;
  private model: TreeModel;
  private view: TreeView;

  public readonly onDidChangeFocus = new RelayEvent<IFocusEvent>();

  constructor(container: HTMLElement, configuration: ITreeConfiguration, options: ITreeOptions) {
    this.container = container;

    this.context = new TreeContext(this, configuration, options);
    this.model = new TreeModel(this.context);
    this.view = new TreeView(this.context, this.container);

    this.view.setModel(this.model);

    this.onDidChangeFocus.event = this.model.onDidFocus;

    this.layout();
  }

  public setRoot(element: any): Promise<any> {
    return this.model.setRoot(element);
  }

  public getRoot(): any {
    return this.model.getRoot();
  }

  public setSelection(elements: any[]): void {
    this.model.setSelection(elements);
  }

  public getSelection(): any[] {
    return this.model.getSelection();
  }

  public refresh(element: any, skipRenderChildren: boolean = false): Promise<any> {
    return this.model.refresh(element, skipRenderChildren);
  }

  public focus(): void {
    this.view.focus();
  }

  public isDOMFocused(): boolean {
    return this.view.isFocused();
  }

  public setHighlight(element: any) {
    this.model.setHightlight(element);
  }

  public clearHighlight() {
    this.model.setHightlight();
  }

  public getFocus(): any {
    return this.model.getFocus();
  }

  public setFocus(element?: any) {
    this.model.setFocus(element);
  }

  public expand(element: any) {
    return this.model.expand(element);
  }

  public expandAll(elements: any[]) {
    return this.model.expandAll(elements);
  }

  public getExpandedElements(): any[] {
    return this.model.getExpandedElements();
  }

  public layout(): void {
    this.view.layout();
  }
}
