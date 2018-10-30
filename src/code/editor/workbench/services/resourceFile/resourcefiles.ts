import { decorator } from '../../../../platform/instantiation/instantiation';
import { ResourceFileService } from './resourceFileService';

export const IResourceFileSerivce = decorator<ResourceFileService>('resourceFileService');
