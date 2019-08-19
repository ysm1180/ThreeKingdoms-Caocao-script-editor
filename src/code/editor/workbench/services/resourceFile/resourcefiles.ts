import { decorator } from '../../../../platform/instantiation/instantiation';
import { ResourceFileService } from './resourceFileService';

export const IResourceFileService = decorator<ResourceFileService>(
    'resourceFileService'
);
