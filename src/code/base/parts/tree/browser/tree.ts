import { RelayEvent } from 'code/base/common/event';
import { TreeModel, IFocusEvent } from 'code/base/parts/tree/browser/treeModel';
import { TreeView } from 'code/base/parts/tree/browser/treeView';
import { IDataSource, IDataRenderer, IDataController } from 'code/editor/workbench/parts/me5ExplorerModel';

export interface ITreeConfiguration {
    dataSource: IDataSource;
    renderer: IDataRenderer;
    controller: IDataController;
}

export interface ITreeOptions {
    indentPixels?: number;
}

export class TreeContext {
    public tree: Tree;
    public dataSource: IDataSource;
    public renderer: IDataRenderer;
    public controller: IDataController;
    public options: ITreeOptions;

    constructor(tree: Tree, configuration: ITreeConfiguration, options: ITreeOptions) {
        this.tree = tree;
        this.dataSource = configuration.dataSource;
        this.renderer = configuration.renderer;
        this.controller = configuration.controller;
        this.options = options;
    }
}

export class Tree {
    private container: HTMLElement;

    private context: TreeContext;
    private model: TreeModel;
    private view: TreeView;

    public onDidChangeFocus = new RelayEvent<IFocusEvent>();

    constructor(
        container: HTMLElement,
        configuration: ITreeConfiguration,
        options: ITreeOptions,
    ) {
        this.container = container;

        this.context = new TreeContext(this, configuration, options);
        this.model = new TreeModel(this.context);
        this.view = new TreeView(this.context, container);

        this.view.setModel(this.model);

        this.onDidChangeFocus.event = this.model.onDidFocus;
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

    public setFocus(element: any) {
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
}