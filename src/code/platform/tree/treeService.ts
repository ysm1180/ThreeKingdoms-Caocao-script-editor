import { Disposable } from 'code/base/common/lifecycle';
import { Tree } from 'code/base/parts/tree/browser/tree';
import { decorator } from 'code/platform/instantiation/instantiation';

export const ITreeService = decorator<TreeService>('treeService');

export class TreeService extends Disposable {
    private _lastFocusedTree: Tree;

    constructor() {
        super();

        this._lastFocusedTree = null;
    }

    public get LastFocusedTree() {
        return this._lastFocusedTree;
    }

    public register(tree: Tree) {
        this._lastFocusedTree = tree;

        this.registerDispose(tree.onDidChangeFocus.add(() => {
            this._lastFocusedTree = tree;
        }));
    }
}