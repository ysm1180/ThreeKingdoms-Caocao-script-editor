import { decorator } from 'code/platform/instantiation/instantiation';
import { ITreeService, TreeService } from 'code/platform/tree/treeService';
import { IMe5Data } from 'code/platform/files/me5Data';

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

        element.setEditable(true);
        lastTree.refresh(element, true).then(() => {
            lastTree.setHighlight(element);
        });
    }

    public doDelete() {
        const lastTree = this.treeService.LastFocusedTree;
        const elements = <IMe5Data[]>lastTree.getSelection();

        elements.forEach(element => {
            const parent = element.getParent();
            element.dispose();
            lastTree.refresh(parent);            
        });

    }
}