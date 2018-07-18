import { ISavingFile } from '../../../../platform/dialogs/dialogs';
import { ISaveMe5Data, Me5File } from '../../../common/file';
import { Me5Stat } from '../../parts/files/me5Data';
import { IDialogService, DialogService } from '../electron-browser/dialogService';
import { decorator, ServiceIdentifier } from '../../../../platform/instantiation/instantiation';
import { ITreeService, TreeService } from '../../../../platform/tree/treeService';

export const IMe5FileService: ServiceIdentifier<Me5FileService> = decorator<Me5FileService>('me5FileService');

export class Me5FileService {
    constructor(
        @IDialogService private dialogService: DialogService,
        @ITreeService private treeService: TreeService,
    ) {

    }

    public resolve(resource: string): Promise<Me5Stat> {
        let done: Promise<Me5Stat>;
        const me5File = new Me5File(resource);
        done = me5File.open().then((data) => {
            if (!data) {
                throw new Error();
            }

            const stat = new Me5Stat(resource, true, null);
            for (let i = 0, groupCount = me5File.getGroupCount(); i < groupCount; i++) {
                const group = new Me5Stat(resource, true, stat, me5File.getGroupName(i));
                group.build(stat);
                for (let j = 0, itemCount = me5File.getGroupItemCount(i); j < itemCount; ++j) {
                    const item = new Me5Stat(resource, false, stat, me5File.getItemName(i, j), me5File.getItemData(i, j));
                    item.build(group);
                }
            }

            return stat;
        }).catch(() => {
            const stat = new Me5Stat(resource, true, null);
            const group = new Me5Stat(resource, true, stat, 'NEW GROUP');
            group.build(stat);

            return stat;
        });

        return done;
    }

    public save(path: string) {
        const stat = this.treeService.LastFocusedTree.getRoot() as Me5Stat;

        let done: Promise<Me5Stat>;
        if (!path) {
            const saving: ISavingFile = {
                title: '다른 이름으로 저장',
                name: 'Untitled',
                extensions: [{
                    extensions: 'me5',
                }]
            };

            done = this.dialogService.save(saving).then((data) => {
                if (!data.file) {
                    return null;
                }

                const newStat = new Me5Stat(data.file, true, null);
                const groups = stat.getChildren((group) => group.getChildren().length !== 0);
                for (const beforeGroup of groups) {
                    const newGroup = new Me5Stat(data.file, true, newStat, beforeGroup.name);
                    newGroup.build(newStat);

                    const items = beforeGroup.getChildren();
                    for (const beforeItem of items) {
                        const newItem = new Me5Stat(data.file, false, newStat, beforeItem.name, beforeItem.data);
                        newItem.build(newGroup);
                    }
                }

                return newStat;
            });
        } else {
            done = Promise.resolve(stat);
        }

        done.then((rootStat) => {
            if (!rootStat) {
                return;
            }

            const options: ISaveMe5Data = {
                root: rootStat
            };

            const file = new Me5File(rootStat.getId());
            file.save(options);
        });
    }
}