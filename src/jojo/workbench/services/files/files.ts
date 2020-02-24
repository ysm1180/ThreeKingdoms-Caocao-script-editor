import { IContent, IStreamContent } from 'jojo/platform/files/common/files';
import { decorator } from 'jojo/platform/instantiation/common/instantiation';

export const IFileService = decorator<IFileService>('fileService');

export interface IFileService {
  resolveContent(resource: string): Promise<IContent>;

  resolveStreamContent(resource: string, encoding?: string): Promise<IStreamContent>;
}

export interface IEditorModel {
  load(): Promise<IEditorModel>;

  dispose(): void;
}
