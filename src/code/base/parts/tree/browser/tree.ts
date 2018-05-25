import { TreeModel } from 'code/base/parts/tree/browser/treeModel';
import { TreeView } from 'code/base/parts/tree/browser/treeView';
import { IDataSource, IDataRenderer, IDataController } from 'code/editor/workbench/parts/me5ExplorerModel';
import { StandardMouseEvent } from '../../../browser/mouseEvent';

export class ContextMenuEvent {
    public readonly posx: number;
    public readonly posy: number;
    public readonly target: HTMLElement;

    constructor(posx: number, posy: number, target: HTMLElement) {
        this.posx = posx;
        this.posy = posy;
        this.target = target;
    }

    public preventDefault(): void {
        // no-op
    }

    public stopPropagation(): void {
        // no-op
    }
}

export class MouseContextMenuEvent extends ContextMenuEvent {
    private originalEvent: StandardMouseEvent;

    constructor(e: StandardMouseEvent) {
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
    }

    public setRoot(element: any): Promise<any> {
        return this.model.setRoot(element);
    }

    public getRoot(): any {
        return this.model.getRoot();
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

    public setHighlight(element: any) {
        this.model.setHightlight(element);
    }

    public clearHighlight() {
        this.model.setHightlight();
    }
}