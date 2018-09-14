import { decorator } from '../../../../platform/instantiation/instantiation';
import { ITextBufferFactory } from '../../../common/models';

export const ITextFileService = decorator<ITextFileService>('textFileService');

export interface ITextFileService {
    resolveTextContent(resource: string): Promise<IRawTextContent>;
}

export interface IRawTextContent {
	value: ITextBufferFactory;
}