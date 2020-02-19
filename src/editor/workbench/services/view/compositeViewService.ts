import { CompositeView } from '../../browser/compositeView';
import { Event } from '../../../../base/common/event';
import { SidebarPart } from '../../browser/parts/sidebarPart';
import { decorator } from '../../../../platform/instantiation/instantiation';

export const ICompositeViewService = decorator<CompositeViewService>('compositeViewService');

export class CompositeViewService {
  private sidebarPart: SidebarPart;

  public get onDidCompositeOpen(): Event<CompositeView> {
    return this.sidebarPart.onDidCompositeOpen;
  }
  public get onDidCompositeClose(): Event<CompositeView> {
    return this.sidebarPart.onDidCompositeClose;
  }

  constructor(sidebarPart: SidebarPart) {
    this.sidebarPart = sidebarPart;
  }
}
