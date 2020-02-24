import { IInstantiationService } from 'jojo/platform/instantiation/common/instantiation';
import { BinaryFileEditorModelManager } from 'jojo/workbench/services/binaryfile/binaryFileEditorModelManager';
import { IBinaryDataService, IBinaryFileService, IResourceStat } from 'jojo/workbench/services/binaryfile/binaryFiles';
import { IRawResourceContent } from 'jojo/workbench/services/textfile/textfiles';

export abstract class BinaryFileService implements IBinaryFileService {
  protected _models: BinaryFileEditorModelManager;

  constructor(protected instantiationService: IInstantiationService) {
    this._models = this.instantiationService.create(BinaryFileEditorModelManager);
  }

  public get models(): BinaryFileEditorModelManager {
    return this._models;
  }

  public abstract resolveRawContent(resource: string): Promise<IRawResourceContent>;
  public abstract save(resource: string): void;
  public abstract updateContents(resource: string, stat: IResourceStat);
}

export abstract class BinaryDataService implements IBinaryDataService {
  constructor() {}

  public abstract resolveFile(resource: string): Promise<IResourceStat>;
}
