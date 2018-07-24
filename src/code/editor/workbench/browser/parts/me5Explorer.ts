import { DomBuilder } from '../../../../base/browser/domBuilder';
import { Tree, ITreeOptions, ITreeConfiguration } from '../../../../base/parts/tree/browser/tree';
import {  IEditorInput } from '../../../../platform/editor/editor';
import { ITreeService, TreeService } from '../../../../platform/tree/treeService';
import { RawContextKey, ContextKeyExpr, ContextKeyNotExpr } from '../../../../platform/contexts/contextKey';
import { ContextKey, IContextKeyService, ContextKeyService } from '../../../../platform/contexts/contextKeyService';
import { IInstantiationService, InstantiationService } from '../../../../platform/instantiation/instantiationService';
import { CompositeView } from '../compositeView';
import { IEditorService, EditorPart } from './editor/editorPart';
import { Me5Stat } from '../../parts/files/me5Data';
import { ICompositeViewService, CompositeViewService } from '../../services/view/compositeViewService';
import { Me5DataSource, Me5DataRenderer, Me5DataController } from '../../parts/me5ExplorerViewer';
import { IMe5FileService, Me5FileService } from '../../services/me5/me5FileService';
import { EditorGroup } from './editor/editors';

export const explorerItemIsMe5GroupId = 'explorerItemIsMe5Group';
export const explorerItemIsMe5StatId = 'explorerItemIsMe5Stat';

export const explorerGroupContext = new RawContextKey<boolean>(explorerItemIsMe5GroupId, false);
export const explorerRootContext = new RawContextKey<boolean>(explorerItemIsMe5StatId, false);

export const explorerItemContext: ContextKeyNotExpr = ContextKeyExpr.not(ContextKeyExpr.or(explorerGroupContext, explorerRootContext));

export class Me5Tree extends Tree {
    private _cache = new Map<IEditorInput, Me5Stat>();

    constructor(
        container: HTMLElement,
        configuration: ITreeConfiguration,
        options: ITreeOptions,
        @ITreeService treeService: TreeService,
    ) {
        super(container,
            {
                dataSource: configuration.dataSource,
                renderer: configuration.renderer,
                controller: configuration.controller
            },
            {
                ...options,
                ...{ indentPixels: 12 }
            }
        );

        treeService.register(this);
    }

    public cache(key: IEditorInput): Me5Stat {
        if (this._cache.has(key)) {
            return this._cache.get(key);
        }

        return null;
    }

    public setCache(key: IEditorInput, value: Me5Stat): void {
        if (key) {
            this._cache.set(key, value);
        }
    }
}

export const EXPLORER_VIEW_ID = 'workbench.view.explorer';

export class Me5ExplorerView extends CompositeView {
    private explorerViewer: Me5Tree;
    private dataSource: Me5DataSource;
    private renderer: Me5DataRenderer;
    private controller: Me5DataController;

    private toExpandElements = {};

    private groupContext: ContextKey<boolean>;
    private rootContext: ContextKey<boolean>;

    private group: EditorGroup;

    constructor(
        @IMe5FileService private me5FileService: Me5FileService,
        @IContextKeyService private contextKeyService: ContextKeyService,
        @IEditorService private editorService: EditorPart,
        @ICompositeViewService private compositeViewService: CompositeViewService,
        @IInstantiationService private instantiationService: InstantiationService,
    ) {
        super(EXPLORER_VIEW_ID);

        this.dataSource = this.instantiationService.create(Me5DataSource);
        this.renderer = this.instantiationService.create(Me5DataRenderer);
        this.controller = this.instantiationService.create(Me5DataController);

        this.groupContext = explorerGroupContext.bindTo(this.contextKeyService);
        this.rootContext = explorerRootContext.bindTo(this.contextKeyService);
    }

    public create(container: DomBuilder) {
        this.explorerViewer = this.instantiationService.create(Me5Tree,
            container.getHTMLElement(),
            {
                dataSource: this.dataSource,
                renderer: this.renderer,
                controller: this.controller
            },
            {}
        );

        this.registerDispose(this.explorerViewer.onDidChangeFocus.add((e) => {
            const focused = e.focus as Me5Stat;
            this.groupContext.set(focused.isGroup && !focused.isRoot);
            this.rootContext.set(focused.isRoot);
        }));
        
        this.group = this.editorService.getEditorGroup();

        this.registerDispose(this.compositeViewService.onDidCompositeOpen.add((composit) => this.onChangeFile(composit)));
        this.registerDispose(this.group.onEditorClosed.add((editor) => {
            this.explorerViewer.setCache(editor, null);

            const activeEditorInput = this.group.activeEditor;
            if (!activeEditorInput) {
                this.explorerViewer.setRoot(null);
                
            }
        }));
    }

    private onChangeFile(composit) {
        if (composit !== this) {
            return;
        }

        const previousRoot = this.explorerViewer.getRoot() as Me5Stat;
        if (previousRoot) {
            this.setExpandedElements(previousRoot.getId());
        }

        const activeEditorInput = this.group.activeEditor;
        if (!activeEditorInput) {
            return;
        }

        let done: Promise<Me5Stat>;
        const filePath = activeEditorInput.getId();
        const cacheData = this.explorerViewer.cache(activeEditorInput);
        if (cacheData) {
            done = Promise.resolve(cacheData);
        } else {
            done = this.me5FileService.resolve(filePath);
        }

        done.then((stat) => {
            this.explorerViewer.setCache(activeEditorInput, stat);

            this.explorerViewer.setRoot(stat).then(() => {
                const toExpand = this.toExpandElements[stat.getId()];
                if (toExpand) {
                    this.explorerViewer.expandAll(toExpand);
                }
            });
        });
    }

    private setExpandedElements(key: string) {
        const expandedElements = this.explorerViewer.getExpandedElements();
        this.toExpandElements[key] = expandedElements;
    }
}