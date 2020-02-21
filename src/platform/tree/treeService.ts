import { Disposable } from '../../base/common/lifecycle';
import { ITree } from '../../base/parts/tree/browser/tree';
import { decorator } from '../instantiation/instantiation';

export const ITreeService = decorator<TreeService>('treeService');

export class TreeService extends Disposable {
  private _lastFocusedTree: ITree;

  constructor() {
    super();

    this._lastFocusedTree = null;
  }

  public get LastFocusedTree() {
    return this._lastFocusedTree;
  }

  public register(tree: ITree) {
    this._lastFocusedTree = tree;

    this.registerDispose(
      tree.onDidChangeFocus.add(() => {
        this._lastFocusedTree = tree;
      })
    );
  }
}
