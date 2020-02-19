import { ISavingFile } from '../../../../platform/dialogs/dialogs';
import { IInstantiationService } from '../../../../platform/instantiation/instantiationService';
import { Me5File } from '../../../common/me5File';
import { createMe5ResourceBufferFactoryFromStream } from '../../../common/resourceModel';
import { DialogService, IDialogService } from '../electron-browser/dialogService';
import { IFileService } from '../files/files';
import { IResourceStat } from '../resourceFile/resourceDataService';
import { ResourceFileService } from '../resourceFile/resourceFileService';
import { IRawResourceContent } from '../textfile/textfiles';

export class Me5FileService extends ResourceFileService {
  constructor(
    @IFileService private fileService: IFileService,
    @IDialogService private dialogService: DialogService,
    @IInstantiationService instantiationService: IInstantiationService
  ) {
    super(instantiationService);
  }

  public resolveRawContent(resource: string): Promise<IRawResourceContent> {
    return this.fileService.resolveStreamContent(resource).then((streamContent) => {
      return createMe5ResourceBufferFactoryFromStream(streamContent.value).then(
        (res) => {
          const r: IRawResourceContent = {
            value: res,
          };
          return r;
        },
        (err) => {
          console.error(err);
          return null;
        }
      );
    });
  }

  public save(resource: string) {
    const model = this._models.get(resource);
    if (model) {
      model.save();
    }
  }

  public updateContents(resource: string, stat: IResourceStat): Promise<void> {
    const file = new Me5File(resource);
    return file.save(stat, (group) => group.getChildren().length !== 0);
  }

  public saveAs() {
    const saving: ISavingFile = {
      title: '다른 이름으로 저장',
      name: 'Untitled',
      extensions: [
        {
          extensions: 'me5',
        },
      ],
    };

    // TODO : 구현하기
    return this.dialogService.saveFile(saving).then((data) => {
      return null;
    });
  }
}
