import { ServiceIdentifier, decorator } from '../../../../platform/instantiation/instantiation';
import { IContent, IStreamContent } from '../../../../platform/files/files';

export const IFileService: ServiceIdentifier<IFileService> = decorator<IFileService>('fileService');

export interface IFileService {
    resolveContent(resource: string): Promise<IContent>;

    resolveStreamContent(resource: string, encoding?: string): Promise<IStreamContent>;
}

export interface IEditorModel {
    load(): Promise<IEditorModel>;

    dispose(): void;
}