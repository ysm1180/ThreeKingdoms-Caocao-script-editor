import { Event } from '../../../../base/common/event';
import { decorator, ServiceIdentifier } from '../../../../platform/instantiation/instantiation';
import { CompositeView } from '../../browser/compositeView';
import { SidebarPart } from '../../browser/parts/sidebarPart';

export const ICompositeViewService: ServiceIdentifier<
    CompositeViewService
> = decorator<CompositeViewService>('compositeViewService');

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
