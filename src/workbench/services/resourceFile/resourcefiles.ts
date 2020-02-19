import { ResourceFileService } from './resourceFileService';
import { decorator } from '../../../platform/instantiation/instantiation';

export const IResourceFileService = decorator<ResourceFileService>('resourceFileService');
