import { ITextBufferFactory } from '../../../common/models';
import { ResourceBufferFactory } from '../../../common/model/resourceBufferBuilder';
import { decorator } from '../../../../platform/instantiation/instantiation';

export const ITextFileService = decorator<ITextFileService>('textFileService');

export interface ITextFileService {
  resolveTextContent(resource: string): Promise<IRawTextContent>;
}

export interface IRawResourceContent {
  value: ResourceBufferFactory;
}
export interface IRawTextContent {
  value: ITextBufferFactory;
}
