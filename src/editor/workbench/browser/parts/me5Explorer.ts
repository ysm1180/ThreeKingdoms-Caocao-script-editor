import { DomBuilder } from '../../../../base/browser/domBuilder';
import { dispose, IDisposable } from '../../../../base/common/lifecycle';
import { ITreeConfiguration, ITreeOptions, Tree } from '../../../../base/parts/tree/browser/tree';
import { ContextKeyExpr, ContextKeyNotExpr, RawContextKey } from '../../../../platform/contexts/contextKey';
import { ContextKey, ContextKeyService, IContextKeyService } from '../../../../platform/contexts/contextKeyService';
import { IInstantiationService } from '../../../../platform/instantiation/instantiationService';
import { ITreeService, TreeService } from '../../../../platform/tree/treeService';
import { ResourceEditorInput } from '../../common/editor/resourceEditorInput';
import { Me5Stat } from '../../parts/files/me5Data';
import { Me5DataController, Me5DataRenderer, Me5DataSource } from '../../parts/me5ExplorerViewer';
import { IResourceStat } from '../../services/resourceFile/resourceDataService';
import { IResourceFileService } from '../../services/resourceFile/resourcefiles';
import { ResourceFileService } from '../../services/resourceFile/resourceFileService';
import { CompositeViewService, ICompositeViewService } from '../../services/view/compositeViewService';
import { CompositeView } from '../compositeView';
import { EditorGroup } from './editor/editorGroup';
import { EditorPart, IEditorGroupService } from './editor/editorPart';

export const me5ExplorerItemIsMe5GroupId = 'explorerItemIsMe5Group';
export const me5ExplorerItemIsMe5StatId = 'explorerItemIsMe5Stat';

export const me5ExplorerGroupContext = new RawContextKey<boolean>(me5ExplorerItemIsMe5GroupId, false);
export const me5ExplorerRootContext = new RawContextKey<boolean>(me5ExplorerItemIsMe5StatId, false);

export const me5ExplorerItemContext: ContextKeyNotExpr = ContextKeyExpr.not(
  ContextKeyExpr.or(me5ExplorerGroupContext, me5ExplorerRootContext)
);

export class Me5Tree extends Tree {
  private _cache = new Map<String, IResourceStat>();

  constructor(
    container: HTMLElement,
    configuration: ITreeConfiguration,
    options: ITreeOptions,
    @ITreeService treeService: TreeService
  ) {
    super(
      container,
      {
        dataSource: configuration.dataSource,
        renderer: configuration.renderer,
        controller: configuration.controller,
      },
      {
        ...options,
        ...{ indentPixels: 12 },
      }
    );

    treeService.register(this);
  }

  public cache(key: String): IResourceStat {
    if (this._cache.has(key)) {
      return this._cache.get(key);
    }

    return null;
  }

  public setCache(key: String, value: IResourceStat): void {
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

  private onceEvents: IDisposable[];

  private pendingPromise: { [id: string]: Promise<any> };

  constructor(
    @IContextKeyService private contextKeyService: ContextKeyService,
    @IEditorGroupService private editorService: EditorPart,
    @ICompositeViewService
    private compositeViewService: CompositeViewService,
    @IResourceFileService private resourceFileService: ResourceFileService,
    @IInstantiationService
    private instantiationService: IInstantiationService
  ) {
    super(EXPLORER_VIEW_ID);

    this.dataSource = this.instantiationService.create(Me5DataSource);
    this.renderer = this.instantiationService.create(Me5DataRenderer);
    this.controller = this.instantiationService.create(Me5DataController);

    this.groupContext = me5ExplorerGroupContext.bindTo(this.contextKeyService);
    this.rootContext = me5ExplorerRootContext.bindTo(this.contextKeyService);

    this.pendingPromise = Object.create(null);

    this.onceEvents = [];
  }

  public create(container: DomBuilder) {
    this.explorerViewer = this.instantiationService.create(
      Me5Tree,
      container.getHTMLElement(),
      {
        dataSource: this.dataSource,
        renderer: this.renderer,
        controller: this.controller,
      },
      {}
    );

    this.registerDispose(
      this.explorerViewer.onDidChangeFocus.add((e) => {
        const focused = e.focus as Me5Stat;
        if (focused) {
          this.groupContext.set(focused.isGroup && !focused.isRoot);
          this.rootContext.set(focused.isRoot);
        }
      })
    );

    this.group = this.editorService.getEditorGroup();

    this.registerDispose(
      this.compositeViewService.onDidCompositeOpen.add((composit) => this._onCompositeOpen(composit))
    );
    this.registerDispose(
      this.compositeViewService.onDidCompositeClose.add((composit) => this._onCompositClose(composit))
    );
    this.registerDispose(
      this.group.onEditorStructureChanged.add((editor) => {
        this.explorerViewer.setCache(editor.getResource(), null);
      })
    );
  }

  private _onCompositeOpen(composit: CompositeView) {
    if (composit !== this) {
      return;
    }

    this.onceEvents.push(
      this.editorService.onEditorInputChanged.add(() => {
        this._onOpenInput();
        this.onceEvents = dispose(this.onceEvents);
      })
    );
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

    const resource = activeEditorInput.getResource();
    if (this.pendingPromise[resource]) {
      return;
    }

    let done: Promise<IResourceStat>;
    const cacheData = this.explorerViewer.cache(resource);
    if (cacheData) {
      done = Promise.resolve(cacheData);
    } else {
      const model = this.resourceFileService.models.get(resource);
      done = Promise.resolve(model.resourceStat);
      this.explorerViewer.setRoot(null);
    }

    this.pendingPromise[resource] = done;
    done.then((stat) => {
      this.explorerViewer.setCache(activeEditorInput.getResource(), stat);
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

        this.pendingPromise[resource] = null;
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
