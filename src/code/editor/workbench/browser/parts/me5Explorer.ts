import { Tree, ITreeOptions, ITreeConfiguration } from 'code/base/parts/tree/browser/tree';
import { Me5DataSource, Me5DataRenderer, Me5DataController } from 'code/editor/workbench/parts/me5ExplorerModel';
import { IView } from 'code/editor/workbench/browser/view';
import { IInstantiationService, InstantiationService } from 'code/platform/instantiation/instantiationService';
import { IEditorService, EditorPart } from 'code/editor/workbench/browser/parts/editor/editorPart';
import { Me5File } from 'code/editor/common/file';
import { Me5Stat, Me5Group, Me5Item } from 'code/editor/workbench/parts/me5ItemModel';

export class Me5Tree extends Tree {
    private cache = new Map<string, Me5Stat>();

    constructor(
        container: HTMLElement,
        configuration: ITreeConfiguration,
        options: ITreeOptions,
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
        this.dataSource = new Me5DataSource();
        this.renderer = new Me5DataRenderer();
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

        this.editorService.onEditorChanged.add(() => {
            const activeEditorInput = this.editorService.getActiveEditorInput();
            if (activeEditorInput === null) {
                this.explorerViewer.setRoot(null);
                return;
            }

            const filePath = activeEditorInput.getResource();
            const stat = new Me5Stat(filePath);
            const me5 = new Me5File(filePath);
            me5.open().then(() => {
                for (let i = 0, groupCount = me5.getGroupCount(); i < groupCount; i++) {
                    const group = new Me5Group();
                    group.build(stat, me5.getGroupName(i));
                    for (let j = 0, itemCount = me5.getGroupItemCount(i); j < itemCount; ++j) {
                        const item = new Me5Item();
                        item.build(group, me5.getItemName(i, j), me5.getItemData(i, j));
                    }
                }

                this.explorerViewer.setRoot(stat);
            });
        });
    }
}