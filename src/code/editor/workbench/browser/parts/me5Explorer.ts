import { Disposable } from 'code/base/common/lifecycle';
import { ITreeService, TreeService } from 'code/platform/tree/treeService';
import { Tree, ITreeOptions, ITreeConfiguration } from 'code/base/parts/tree/browser/tree';
import { IInstantiationService, InstantiationService } from 'code/platform/instantiation/instantiationService';
import { Me5File } from 'code/editor/common/file';
import { IView } from 'code/editor/workbench/browser/view';
import { Me5Stat, Me5Group, Me5Item } from 'code/editor/workbench/parts/files/me5Data';
import { Me5DataSource, Me5DataRenderer, Me5DataController } from 'code/editor/workbench/parts/me5ExplorerModel';
import { IEditorService, EditorPart } from 'code/editor/workbench/browser/parts/editor/editorPart';
import { IEditorClosedEvent } from 'code/platform/editor/editor';
import { ContextKey, IContextKeyService, ContextKeyService } from 'code/platform/contexts/contextKeyService';
import { RawContextKey } from 'code/platform/contexts/contextKey';

export const explorerItemIsMe5GroupId = 'explorerItemIsMe5Group';
export const explorerItemIsMe5StatId = 'explorerItemIsMe5Stat';

export const explorerGroupContext = new RawContextKey<boolean>(explorerItemIsMe5GroupId, false);
export const explorerRootContext = new RawContextKey<boolean>(explorerItemIsMe5StatId, false);

export class Me5Tree extends Tree {
    private _cache = new Map<string, Me5Stat>();

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

    public cache(key: string): Me5Stat {
        if (this._cache.has(key)) {
            return this._cache.get(key);
        }

        return null;
    }

    public setCache(key: string, value: Me5Stat): void {
        this._cache.set(key, value);
    }
}

export class Me5ExplorerView extends Disposable implements IView {
    private explorerViewer: Me5Tree;
    private dataSource: Me5DataSource;
    private renderer: Me5DataRenderer;
    private controller: Me5DataController;

    private toExpandElements = {};

    private groupContext: ContextKey<boolean>;
    private rootContext: ContextKey<boolean>;

    constructor(
        @IContextKeyService contextKeyService: ContextKeyService,
        @IEditorService private editorService: EditorPart,
        @IInstantiationService private instantiationService: InstantiationService,

    ) {
        super();

        this.dataSource = this.instantiationService.create(Me5DataSource);
        this.renderer = this.instantiationService.create(Me5DataRenderer);
        this.controller = this.instantiationService.create(Me5DataController);

        this.groupContext = explorerGroupContext.bindTo(contextKeyService);
        this.rootContext = explorerRootContext.bindTo(contextKeyService);
    }

    public create(container: HTMLElement) {
        this.explorerViewer = this.instantiationService.create(Me5Tree,
            container,
            {
                dataSource: this.dataSource,
                renderer: this.renderer,
                controller: this.controller
            },
            {}
        );

        this.registerDispose(this.explorerViewer.onDidChangeFocus.add((e) => {
            const focused = e.focus;
            this.groupContext.set(focused instanceof Me5Group);
            this.rootContext.set(focused instanceof Me5Stat);
        }));

        this.registerDispose(this.editorService.onEditorChanged.add(() => this.onChangeFile()));

        this.registerDispose(this.editorService.onEditorClosed.add((e: IEditorClosedEvent) => {
            const closedEditor = e.editor;
            this.explorerViewer.setCache(closedEditor.getId(), null);
            this.editorService.setInput(null);
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
        const cacheData = this.explorerViewer.cache(filePath);
        if (cacheData) {
            done = Promise.resolve(cacheData);
        } else {
            const me5 = new Me5File(filePath);
            done = me5.open().then((data) => {
                if (!data) {
                    throw new Error();
                }

                console.log(data);
                const stat = new Me5Stat(filePath);
                for (let i = 0, groupCount = me5.getGroupCount(); i < groupCount; i++) {
                    const group = new Me5Group();
                    group.build(stat, null, me5.getGroupName(i));
                    for (let j = 0, itemCount = me5.getGroupItemCount(i); j < itemCount; ++j) {
                        const item = new Me5Item();
                        item.build(group, null, me5.getItemName(i, j), me5.getItemData(i, j));
                    }
                }

                return stat;
            }).catch(() => {
                const stat = new Me5Stat(filePath);
                const group = new Me5Group();
                group.build(stat, null, 'NEW GROUP');
                
                return stat;
            });
        }

        done.then((stat) => {
            this.explorerViewer.setCache(filePath, stat);
            
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