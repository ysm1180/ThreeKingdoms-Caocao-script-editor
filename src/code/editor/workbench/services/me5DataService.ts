import { decorator } from 'code/platform/instantiation/instantiation';
import { Me5Group, Me5Item, IMe5Data, Me5Stat } from 'code/editor/workbench/parts/me5ItemModel';
import { ITreeService, TreeService } from 'code/platform/tree/treeService';

export const IMe5DataService = decorator<Me5DataService>('me5DataService');

export class Me5DataService {
    constructor(
        @ITreeService private treeService: TreeService,
    ) {

    }

    public doRename() {
        const lastTree = this.treeService.LastFocusedTree;
        const element = <IMe5Data>lastTree.getSelection()[0];

        if (!element) {
            return;
        }

        if (element instanceof Me5Stat) {
            return;
        }

        element.setEditable(true);
        lastTree.refresh(element, true).then(() => {
            
        });
        
    }
}