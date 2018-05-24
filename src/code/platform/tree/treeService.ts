import { Tree } from 'code/base/parts/tree/browser/tree';
import { decorator } from 'code/platform/instantiation/instantiation';

export const ITreeService = decorator<TreeService>('treeService');

export class TreeService {
    private _lastFocusedTree: Tree;

    constructor() {
        this._lastFocusedTree = null;
    }

    public get LastFocusedTree() {
        return this._lastFocusedTree;
    }

    public register(tree: Tree) {
        this._lastFocusedTree = tree;
    }
}