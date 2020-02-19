import { IInstantiationService } from '../../../platform/instantiation/instantiation';
import { IRawResourceContent } from '../textfile/textfiles';
import { BinaryFileEditorModelManager } from './binaryFileEditorModelManager';
import { IResourceStat } from './resourceDataService';

export abstract class BinaryFileService {
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
