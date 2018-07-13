import { DomBuilder } from '../../../../base/browser/domBuilder';
import { Tree, ITreeOptions, ITreeConfiguration } from '../../../../base/parts/tree/browser/tree';
import { IEditorEvent, IEditorInput } from '../../../../platform/editor/editor';
import { ITreeService, TreeService } from '../../../../platform/tree/treeService';
import { RawContextKey, ContextKeyExpr } from '../../../../platform/contexts/contextKey';
import { ContextKey, IContextKeyService, ContextKeyService } from '../../../../platform/contexts/contextKeyService';
import { IInstantiationService, InstantiationService } from '../../../../platform/instantiation/instantiationService';
import { Me5File } from '../../../common/file';
import { CompositeView } from '../compositeView';
import { IEditorService, EditorPart } from './editor/editorPart';
import { Me5Stat } from '../../parts/files/me5Data';
import { ICompositeViewService, CompositeViewService } from '../../services/view/compositeViewService';
import { Me5DataSource, Me5DataRenderer, Me5DataController } from '../../parts/me5ExplorerViewer';

export const explorerItemIsMe5GroupId = 'explorerItemIsMe5Group';
export const explorerItemIsMe5StatId = 'explorerItemIsMe5Stat';

export const explorerGroupContext = new RawContextKey<boolean>(explorerItemIsMe5GroupId, false);
export const explorerRootContext = new RawContextKey<boolean>(explorerItemIsMe5StatId, false);

export const explorerItemContext = ContextKeyExpr.not(ContextKeyExpr.or(explorerGroupContext, explorerRootContext));

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

    constructor(
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

        this.registerDispose(this.compositeViewService.onDidCompositeOpen.add(() => this.onChangeFile()));

        this.registerDispose(this.editorService.onEditorClosed.add((e: IEditorEvent) => {
            const closedEditor = e.editor;
            this.explorerViewer.setCache(closedEditor, null);
        }));
    }

    public onChangeFile() {
        const previousRoot = this.explorerViewer.getRoot() as Me5Stat;
        if (previousRoot) {
            this.setExpandedElements(previousRoot.getId());
        }

        const activeEditorInput = this.editorService.getActiveEditorInput();
        if (activeEditorInput === null) {
            this.explorerViewer.setRoot(null);
            return;
        }

        let done: Promise<Me5Stat>;
        const filePath = activeEditorInput.getId();
        const cacheData = this.explorerViewer.cache(activeEditorInput);
        if (cacheData) {
            done = Promise.resolve(cacheData);
        } else {
            const me5File = new Me5File(filePath);
            done = me5File.open().then((data) => {
                if (!data) {
                    throw new Error();
                }

                const stat = new Me5Stat(filePath, true, null);
                for (let i = 0, groupCount = me5File.getGroupCount(); i < groupCount; i++) {
                    const group = new Me5Stat(filePath, true, stat, me5File.getGroupName(i));
                    group.build(stat);
                    for (let j = 0, itemCount = me5File.getGroupItemCount(i); j < itemCount; ++j) {
                        const item = new Me5Stat(filePath, false, stat, me5File.getItemName(i, j), me5File.getItemData(i, j));
                        item.build(group);
                    }
                }
                return stat;
            }).catch(() => {
                const stat = new Me5Stat(filePath, true, null);
                const group = new Me5Stat(filePath, true, stat, 'NEW GROUP');
                group.build(stat);

                return stat;
            });
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