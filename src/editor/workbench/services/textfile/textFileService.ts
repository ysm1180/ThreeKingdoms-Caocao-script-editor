import { createTextBufferFactoryFromStream } from '../../../common/textModel';
import { IFileService } from '../files/files';
import { IRawTextContent, ITextFileService } from './textfiles';

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
