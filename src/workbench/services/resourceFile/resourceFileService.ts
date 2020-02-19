import { IInstantiationService } from '../../../platform/instantiation/instantiation';
import { IRawResourceContent } from '../textfile/textfiles';
import { IResourceStat } from './resourceDataService';
import { ResourceFileEditorModelManager } from './resourceFileEditorModelManager';

export abstract class ResourceFileService {
  protected _models: ResourceFileEditorModelManager;

  constructor(protected instantiationService: IInstantiationService) {
    this._models = this.instantiationService.create(ResourceFileEditorModelManager);
  }

  public get models(): ResourceFileEditorModelManager {
    return this._models;
  }

  public abstract resolveRawContent(resource: string): Promise<IRawResourceContent>;
  public abstract save(resource: string): void;
  public abstract updateContents(resource: string, stat: IResourceStat);
}
