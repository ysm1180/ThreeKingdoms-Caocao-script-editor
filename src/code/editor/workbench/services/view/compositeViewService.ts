import { Event } from 'code/base/common/event';
import { decorator } from 'code/platform/instantiation/instantiation';
import { SidebarPart } from 'code/editor/workbench/browser/parts/sidebarPart';
import { CompositeView } from 'code/editor/workbench/browser/compositeView';

export const ICompositeViewService = decorator<CompositeViewService>('compositeViewService');

export class CompositeViewService {
    private sidebarPart: SidebarPart;

    public get onDidCompositeOpen(): Event<CompositeView> { return this.sidebarPart.onDidCompositeOpen; }
    public get onDidCompositeClose(): Event<CompositeView> { return this.sidebarPart.onDidCompositeClose; }
    
    constructor(
        sidebarPart: SidebarPart,
    ) {
        this.sidebarPart = sidebarPart;
    }
}