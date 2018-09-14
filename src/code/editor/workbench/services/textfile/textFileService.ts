import { ITextFileService, IRawTextContent } from './textfiles';
import { createTextBufferFactoryFromStream } from '../../../common/textModel';
import { IFileService } from '../files/files';

export class TextFileService implements ITextFileService{
    constructor(
        @IFileService private fileService: IFileService,
    ) {
    }   
    
    public resolveTextContent(resource: string) {
        return this.fileService.resolveStream(resource).then((streamContent) => {
            return createTextBufferFactoryFromStream(streamContent.value).then(res => {
				const r: IRawTextContent = {
					value: res
				};
				return r;
			});
        });
    }
}