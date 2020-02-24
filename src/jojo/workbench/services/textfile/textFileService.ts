import { createTextBufferFactoryFromStream } from 'jojo/editor/common/textModel';
import { IFileService } from 'jojo/workbench/services/files/files';
import { IRawTextContent, ITextFileService } from 'jojo/workbench/services/textfile/textfiles';

export class TextFileService implements ITextFileService {
  constructor(@IFileService private fileService: IFileService) {}

  public resolveTextContent(resource: string) {
    return this.fileService.resolveStreamContent(resource, 'utf-8').then((streamContent) => {
      return createTextBufferFactoryFromStream(streamContent.value).then((res) => {
        const r: IRawTextContent = {
          value: res,
        };
        return r;
      });
    });
  }
}
