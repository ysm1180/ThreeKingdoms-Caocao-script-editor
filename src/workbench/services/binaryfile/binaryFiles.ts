import { decorator } from '../../../platform/instantiation/instantiation';
import { BinaryFileService } from './binaryFileService';

export const IResourceFileService = decorator<BinaryFileService>('binaryFileService');
