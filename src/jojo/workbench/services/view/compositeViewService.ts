import { Event } from 'jojo/base/common/event';
import { decorator } from 'jojo/platform/instantiation/common/instantiation';
import { CompositeView } from 'jojo/workbench/browser/compositeView';
import { SidebarPart } from 'jojo/workbench/browser/parts/sidebar/sidebarPart';

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
