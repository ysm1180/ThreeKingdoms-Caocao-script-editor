import { ISavingFile } from '../../../../platform/dialogs/dialogs';
import { ISaveMe5Data, Me5File } from '../../../common/me5File';
import { Me5Stat } from '../../parts/files/me5Data';
import { IDialogService, DialogService } from '../electron-browser/dialogService';
import { decorator, ServiceIdentifier } from '../../../../platform/instantiation/instantiation';
import { ITreeService, TreeService } from '../../../../platform/tree/treeService';
import { IFileHandleService } from '../files/files';
import { IInstantiationService } from '../../../../platform/instantiation/instantiationService';

export const IMe5FileService: ServiceIdentifier<Me5FileService> = decorator<Me5FileService>('me5FileService');

export class Me5FileService implements IFileHandleService {
    constructor(
        @IDialogService private dialogService: DialogService,
        @ITreeService private treeService: TreeService,
        @IInstantiationService private instantiationService: IInstantiationService,
    ) {

    }

    public resolve(filePath: string, resource?: Buffer): Promise<Me5Stat> {
        let done: Promise<Me5Stat>;
        const me5File = new Me5File(resource ? resource : filePath);
        done = me5File.open().then((file) => {
            if (!file) {
                throw new Error();
            }

            let baseItemIndex = 1;
            const stat = this.instantiationService.create(Me5Stat, filePath, true, null, null, null);
            for (let i = 0, groupCount = me5File.getGroupCount(); i < groupCount; i++) {
                const group = this.instantiationService.create(Me5Stat, filePath, true, stat, me5File.getGroupName(i), null);
                group.build(stat);
                for (let j = 0, itemCount = me5File.getGroupItemCount(i); j < itemCount; ++j) {
                    const item = this.instantiationService.create(Me5Stat, filePath, false, stat, me5File.getItemName(i, j), baseItemIndex);
                    item.build(group);
                    baseItemIndex++;
                }
            }

            return stat;
        }).catch(() => {
            return null;
        });

        return done;
    }

    public save(path: string) {
        const stat = this.treeService.LastFocusedTree.getRoot() as Me5Stat;

        let done: Promise<Me5Stat>;
        if (!path) {
            done = this.saveAs();
        } else {
            done = Promise.resolve(stat);
        }

        done.then((rootStat) => {
            if (rootStat) {
                const options: ISaveMe5Data = {
                    root: rootStat
                };

                const file = new Me5File(rootStat.getId());
                file.save(options, (group) => group.getChildren().length !== 0);
            }
        });
    }

    public saveAs() {
        const saving: ISavingFile = {
            title: '다른 이름으로 저장',
            name: 'Untitled',
            extensions: [{
                extensions: 'me5',
            }]
        };

        return this.dialogService.saveFile(saving).then((data) => {
            if (!data.file) {
                return null;
            }

            const stat = this.treeService.LastFocusedTree.getRoot() as Me5Stat;
            const groups = stat.getChildren((group) => group.getChildren().length !== 0);

            stat.resource = data.file;
            for (const group of groups) {
                group.resource = data.file;

                const items = group.getChildren();
                for (const item of items) {
                    item.resource = data.file;
                }
            }

            return stat;
        });
    }
}