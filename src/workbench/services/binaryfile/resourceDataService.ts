import { decorator } from '../../../platform/instantiation/instantiation';

export type FilterFuntion<T> = (e: T) => boolean;

export interface IResourceStat {
  name: string;

  data: Buffer;

  getId(): string;

  getChildren(filter?: FilterFuntion<IResourceStat>): IResourceStat[];
}

export const IResourceDataService = decorator<ResourceDataService>('resourceDataService');

export abstract class ResourceDataService {
  constructor() {}

  public abstract resolveFile(resource: string): Promise<IResourceStat>;
}
