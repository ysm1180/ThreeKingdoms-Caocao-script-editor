import { Disposable } from '../../base/common/lifecycle';
import { Tree } from '../../base/parts/tree/browser/tree';
import { decorator, ServiceIdentifier } from '../instantiation/instantiation';

export const ITreeService: ServiceIdentifier<TreeService> = decorator<TreeService>('treeService');

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