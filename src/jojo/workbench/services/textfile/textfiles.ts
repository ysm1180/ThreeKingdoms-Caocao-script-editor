import { ResourceBufferFactory } from 'jojo/editor/common/model/resourceBufferBuilder';
import { ITextBufferFactory } from 'jojo/editor/common/models';
import { decorator } from 'jojo/platform/instantiation/common/instantiation';

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
