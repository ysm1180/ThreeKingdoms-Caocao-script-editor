import { ServiceIdentifier, decorator } from '../../../../platform/instantiation/instantiation';
import { IContent, IStreamContent } from '../../../../platform/files/files';

export const IFileService: ServiceIdentifier<IFileService> = decorator<IFileService>('fileService');

export interface IFileService {
    resolveContent(resource: string): Promise<IContent>;

    resolveStream(resource: string): Promise<IStreamContent>;
}