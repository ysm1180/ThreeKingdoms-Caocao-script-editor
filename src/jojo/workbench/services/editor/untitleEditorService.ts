import { IInstantiationService } from 'jojo/platform/instantiation/common/instantiation';

export class UntitleEditorService {
  constructor(@IInstantiationService private instantiationService: IInstantiationService) {}

  public create(resource: string) {}
}
