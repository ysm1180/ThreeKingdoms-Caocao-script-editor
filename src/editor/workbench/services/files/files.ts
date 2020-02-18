import { IContent, IStreamContent } from '../../../../platform/files/files';
import { decorator, ServiceIdentifier } from '../../../../platform/instantiation/instantiation';

export const IFileService: ServiceIdentifier<IFileService> = decorator<
    IFileService
>('fileService');

export interface IFileService {
    resolveContent(resource: string): Promise<IContent>;

    resolveStreamContent(
        resource: string,
        encoding?: string
    ): Promise<IStreamContent>;
}

export interface IEditorModel {
    load(): Promise<IEditorModel>;

    dispose(): void;
}
