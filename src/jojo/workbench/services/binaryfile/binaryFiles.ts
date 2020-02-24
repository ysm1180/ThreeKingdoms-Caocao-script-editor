import { IResourceModel } from 'jojo/editor/common/models';
import { decorator } from 'jojo/platform/instantiation/common/instantiation';
import { IEditorModel } from 'jojo/workbench/services/files/files';
import { IRawResourceContent } from 'jojo/workbench/services/textfile/textfiles';

export const IBinaryFileService = decorator<IBinaryFileService>('binaryFileService');
export const IBinaryDataService = decorator<IBinaryDataService>('binaryDataService');

export interface IBinaryFileService {
  models: IBinaryFileEditorModelManager;

  resolveRawContent(resource: string): Promise<IRawResourceContent>;

  save(resource: string): void;

  updateContents(resource: string, stat: IResourceStat): Promise<void>;
}

export interface IBinaryDataService {
  resolveFile(resource: string): Promise<IResourceStat>;
}

export interface IBinaryFileEditorModelManager {
  get(resource: string): IBinaryFileEditorModel;
}

export interface IBinaryFileEditorModel extends IEditorModel {
  resourceModel: IResourceModel;

  resourceStat: IResourceStat;

  setDataIndex(index: number): void;
}

export type FilterFuntion<T> = (e: T) => boolean;

export interface IResourceStat {
  name: string;

  data: Buffer;

  getId(): string;

  getChildren(filter?: FilterFuntion<IResourceStat>): IResourceStat[];
}
