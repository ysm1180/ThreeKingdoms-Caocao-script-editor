import { IInstantiationService } from '../../../platform/instantiation/instantiation';

export class UntitleEditorService {
  constructor(@IInstantiationService private instantiationService: IInstantiationService) {}

  public create(resource: string) {}
}
