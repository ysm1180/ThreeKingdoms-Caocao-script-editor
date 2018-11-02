import { DomBuilder } from '../../../../base/browser/domBuilder';
import { Tree, ITreeOptions, ITreeConfiguration } from '../../../../base/parts/tree/browser/tree';
import { IEditorInput } from '../../../../platform/editor/editor';
import { ITreeService, TreeService } from '../../../../platform/tree/treeService';
import { RawContextKey, ContextKeyExpr, ContextKeyNotExpr } from '../../../../platform/contexts/contextKey';
import { ContextKey, IContextKeyService, ContextKeyService } from '../../../../platform/contexts/contextKeyService';
import { IInstantiationService } from '../../../../platform/instantiation/instantiationService';
import { CompositeView } from '../compositeView';
import { IEditorGroupService, EditorPart } from './editor/editorPart';
import { Me5Stat } from '../../parts/files/me5Data';
import { ICompositeViewService, CompositeViewService } from '../../services/view/compositeViewService';
import { Me5DataSource, Me5DataRenderer, Me5DataController } from '../../parts/me5ExplorerViewer';
import { EditorGroup } from './editor/editorGroup';
import { IDisposable, dispose } from '../../../../base/common/lifecycle';
import { ResourceEditorInput } from '../../common/editor/resourceEditorInput';
import { IMe5DataService, Me5DataService } from '../../services/me5/me5DataService';

export const me5ExplorerItemIsMe5GroupId = 'explorerItemIsMe5Group';
export const me5ExplorerItemIsMe5StatId = 'explorerItemIsMe5Stat';

export const me5ExplorerGroupContext = new RawContextKey<boolean>(me5ExplorerItemIsMe5GroupId, false);
export const me5ExplorerRootContext = new RawContextKey<boolean>(me5ExplorerItemIsMe5StatId, false);

export const me5ExplorerItemContext: ContextKeyNotExpr = ContextKeyExpr.not(ContextKeyExpr.or(me5ExplorerGroupContext, me5ExplorerRootContext));

export class Me5Tree extends Tree {
    private _cache = new Map<String, Me5Stat>();

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

    public cache(key: String): Me5Stat {
        if (this._cache.has(key)) {
            return this._cache.get(key);
        }

        return null;
    }

    public setCache(key: String, value: Me5Stat): void {
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
    private toSelectElements = {};

    private groupContext: ContextKey<boolean>;
    private rootContext: ContextKey<boolean>;

    private group: EditorGroup;

    private prevInput: IEditorInput;

    private onceEvents: IDisposable[];

    private pendingPromise: Promise<any>;

    constructor(
        @IMe5DataService private me5DataService: Me5DataService,
        @IContextKeyService private contextKeyService: ContextKeyService,
        @IEditorGroupService private editorService: EditorPart,
        @ICompositeViewService private compositeViewService: CompositeViewService,
        @IInstantiationService private instantiationService: IInstantiationService,
    ) {
        super(EXPLORER_VIEW_ID);

        this.dataSource = this.instantiationService.create(Me5DataSource);
        this.renderer = this.instantiationService.create(Me5DataRenderer);
        this.controller = this.instantiationService.create(Me5DataController);

        this.groupContext = me5ExplorerGroupContext.bindTo(this.contextKeyService);
        this.rootContext = me5ExplorerRootContext.bindTo(this.contextKeyService);

        this.prevInput = null;
        this.pendingPromise = null;

        this.onceEvents = [];
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
            if (focused) {
                this.groupContext.set(focused.isGroup && !focused.isRoot);
                this.rootContext.set(focused.isRoot);
            }
        }));

        this.group = this.editorService.getEditorGroup();

        this.registerDispose(this.compositeViewService.onDidCompositeOpen.add((composit) => this._onCompositeOpen(composit)));
        this.registerDispose(this.compositeViewService.onDidCompositeClose.add((composit) => this._onCompositClose(composit)));
        this.registerDispose(this.group.onEditorStructureChanged.add((editor) => {
            this.explorerViewer.setCache(editor.getId(), null);
        }));
    }

    private _onCompositeOpen(composit: CompositeView) {
        if (composit !== this) {
            return;
        }

        this.onceEvents.push(this.editorService.onEditorInputChanged.add(() => {
            this._onOpenInput();
            this.onceEvents = dispose(this.onceEvents);
        }));
    }

    private _onCompositClose(composit: CompositeView) {
        if (composit !== this) {
            return;
        }

        this.onceEvents = dispose(this.onceEvents);
    }

    private _onOpenInput() {
        const previousRoot = this.explorerViewer.getRoot() as Me5Stat;
        if (previousRoot) {
            this.setElementStates(previousRoot.getId());
        }

        const activeEditorInput = <ResourceEditorInput>this.group.activeEditorInput;
        if (!activeEditorInput) {
            return;
        }

        if (this.pendingPromise) {
            return;
        }

        let done: Promise<Me5Stat>;
        const filePath = activeEditorInput.getId();
        const cacheData = this.explorerViewer.cache(activeEditorInput.getId());
        if (cacheData) {
            done = Promise.resolve(cacheData);
        } else {
            done = this.me5DataService.resolveFile(filePath);
        }

        this.pendingPromise = done;
        done.then((stat) => {
            this.explorerViewer.setCache(activeEditorInput.getId(), stat);
            this.explorerViewer.setRoot(stat).then(() => {
                let expandPromise: Promise<any>;
                const toExpand = this.toExpandElements[stat.getId()];
                if (toExpand) {
                    expandPromise = this.explorerViewer.expandAll(toExpand);
                } else {
                    expandPromise = Promise.resolve();
                }

                const toSelect = this.toSelectElements[stat.getId()];
                if (toSelect) {
                    expandPromise.then(() => {
                        this.explorerViewer.setSelection(toSelect);
                    });
                }

                this.pendingPromise = null;
            });
        });
    }

    private setElementStates(key: string) {
        const expandedElements = this.explorerViewer.getExpandedElements();
        const selectedElements = this.explorerViewer.getSelection();
        this.toExpandElements[key] = expandedElements;
        this.toSelectElements[key] = selectedElements;
    }

    public layout(): void {
        if (this.explorerViewer) {
            this.explorerViewer.layout();
        }
    }

    public dispose(): void {
        dispose(this.onceEvents);

        this.onceEvents = [];
    }
}