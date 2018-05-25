import { Tree, ITreeOptions, ITreeConfiguration } from 'code/base/parts/tree/browser/tree';
import { Me5DataSource, Me5DataRenderer, Me5DataController } from 'code/editor/workbench/parts/me5ExplorerModel';
import { IView } from 'code/editor/workbench/browser/view';
import { IInstantiationService, InstantiationService } from 'code/platform/instantiation/instantiationService';
import { IEditorService, EditorPart, IEditorClosedEvent } from 'code/editor/workbench/browser/parts/editor/editorPart';
import { Me5File } from 'code/editor/common/file';
import { Me5Stat, Me5Group, Me5Item } from 'code/editor/workbench/parts/files/me5DataModel';
import { ITreeService, TreeService } from 'code/platform/tree/treeService';

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

export class Me5ExplorerView implements IView {
    private explorerViewer: Me5Tree;
    private dataSource: Me5DataSource;
    private renderer: Me5DataRenderer;
    private controller: Me5DataController;

    constructor(
        @IEditorService private editorService: EditorPart,
        @IInstantiationService private instantiationService: InstantiationService,

    ) {
        this.dataSource = this.instantiationService.create(Me5DataSource);
        this.renderer = this.instantiationService.create(Me5DataRenderer);
        this.controller = this.instantiationService.create(Me5DataController);
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

        this.editorService.onEditorChanged.add(() => this.onChangeFile());

        this.editorService.onEditorClosed.add((e: IEditorClosedEvent) => {
            const closedEditor = e.editor;
            this.explorerViewer.setCache(e.editor.getResource(), null);
        });
    }

    public onChangeFile() {
        const activeEditorInput = this.editorService.getActiveEditorInput();
        if (activeEditorInput === null) {
            this.explorerViewer.setRoot(null);
            return;
        }

        let done;
        const filePath = activeEditorInput.getResource();
        const cacheData = this.explorerViewer.cache(filePath);
        if (cacheData) {
            done = Promise.resolve(cacheData);
        } else {
            const me5 = new Me5File(filePath);
            done = me5.open().then(() => {
                const stat = new Me5Stat(filePath);
                for (let i = 0, groupCount = me5.getGroupCount(); i < groupCount; i++) {
                    const group = new Me5Group();
                    group.build(stat, me5.getGroupName(i));
                    for (let j = 0, itemCount = me5.getGroupItemCount(i); j < itemCount; ++j) {
                        const item = new Me5Item();
                        item.build(group, me5.getItemName(i, j), me5.getItemData(i, j));
                    }
                }

                this.explorerViewer.setCache(filePath, stat);
                return stat;
            });
        }

        done.then((stat) => {
            this.explorerViewer.setRoot(stat);
        });
    }
}