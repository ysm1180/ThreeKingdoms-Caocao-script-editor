import { ISavingFile } from '../../../../platform/dialogs/dialogs';
import { ISaveMe5Data, Me5File } from '../../../common/me5File';
import { Me5Stat } from '../../parts/files/me5Data';
import { IDialogService, DialogService } from '../electron-browser/dialogService';
import { decorator, ServiceIdentifier } from '../../../../platform/instantiation/instantiation';
import { ITreeService, TreeService } from '../../../../platform/tree/treeService';
import { IInstantiationService } from '../../../../platform/instantiation/instantiationService';
import { ResourceFileService } from '../resourceFile/resourceFileService';
import { IRawResourceContent } from '../textfile/textfiles';
import { createMe5ResourceBufferFactoryFromStream } from '../../../common/resourceModel';
import { IFileService } from '../files/files';

export const IMe5FileService: ServiceIdentifier<Me5FileService> = decorator<Me5FileService>('me5FileService');

export class Me5FileService extends ResourceFileService {
    constructor(
        @IFileService private fileService: IFileService,
        @IDialogService private dialogService: DialogService,
        @ITreeService private treeService: TreeService,
        @IInstantiationService instantiationService: IInstantiationService,
    ) {
        super(instantiationService);
    }

    public resolveRawContent(resource: string): Promise<IRawResourceContent> {
        return this.fileService.resolveStreamContent(resource).then((streamContent) => {
            return createMe5ResourceBufferFactoryFromStream(streamContent.value).then(res => {
                const r: IRawResourceContent = {
                    value: res
                };
                return r;
            }, (err) => {
                console.error(err);
                return null;
            });
        });
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


                const file = new Me5File(path);
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
            return stat;
        });
    }
}