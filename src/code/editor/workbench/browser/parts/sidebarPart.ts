import { Event } from 'code/base/common/event';
import { DomBuilder, $ } from 'code/base/browser/domBuilder';
import { FILE_TYPE } from 'code/platform/files/file';
import { IInstantiationService, InstantiationService } from 'code/platform/instantiation/instantiationService';
import { Part } from 'code/editor/workbench/browser/part';
import { CompositeView, CompositViewRegistry } from 'code/editor/workbench/browser/compositeView';
import { EXPLORER_VIEW_ID } from 'code/editor/workbench/browser/parts/me5Explorer';
import { IEditorService, EditorPart } from 'code/editor/workbench/browser/parts/editor/editorPart';

const mapFileTypeToCompositeId = {
    [FILE_TYPE.ME5]: EXPLORER_VIEW_ID,
};

export class SidebarPart extends Part {
    private instantiatedComposites: CompositeView[];
    private activeComposite: CompositeView;

    private mapCompositeToCompositeContainer: { [id: string]: DomBuilder };

    public onDidCompositeOpen = new Event<CompositeView>();
    public onDidCompositeClose = new Event<CompositeView>();

    constructor(
        @IEditorService private editorService: EditorPart,
        @IInstantiationService private instantiationService: InstantiationService,
    ) {
        super();

        this.activeComposite = null;
        this.instantiatedComposites = [];
        this.mapCompositeToCompositeContainer = {};

        this.editorService.onEditorChanged.add(() => this.onEditorChanged());
    }

    private onEditorChanged() {
        const activeInput = this.editorService.getActiveEditorInput();
        if (!activeInput) {
            return;
        }

        const id = mapFileTypeToCompositeId[activeInput.getType()];
        this.openCompositeView(id);
    }

    public openCompositeView(id: string) {
        if (this.activeComposite && this.activeComposite.getId() === id) {
            return;
        }

        const composite = this.doOpenCompositeView(id);

        this.onDidCompositeOpen.fire(composite);
    }

    private doOpenCompositeView(id: string): CompositeView {
        if (this.activeComposite) {
            this.hideActiveComposite();
        }

        const composite = this.createCompositeView(id);
        if (!composite) {
            return null;
        }

        this.activeComposite = composite;

        let compositeContainer = this.mapCompositeToCompositeContainer[composite.getId()];
        if (!compositeContainer) {
            compositeContainer = $().div({
                'class': 'composite',
                id: composite.getId()
            });

            this.mapCompositeToCompositeContainer[composite.getId()] = compositeContainer;

            composite.create(compositeContainer);
        }

        compositeContainer.build(this.getContentArea());

        return composite;
    }

    private createCompositeView(id: string): CompositeView {
        for (let i = 0; i < this.instantiatedComposites.length; i++) {
            if (this.instantiatedComposites[i].getId() === id) {
                return this.instantiatedComposites[i];
            }
        }

        const compositeDescriptor = CompositViewRegistry.getCompositeView(id);
        if (compositeDescriptor) {
            const composite = this.instantiationService.create(compositeDescriptor.ctor);
            this.instantiatedComposites.push(composite);
            return composite;
        }

        return null;
    }

    private hideActiveComposite() {
        if (!this.activeComposite) {
            return;
        }

        const composite = this.activeComposite;
        this.activeComposite = null;

        const compositeContainer = this.mapCompositeToCompositeContainer[composite.getId()];
        compositeContainer.offDOM();

        this.onDidCompositeClose.fire(composite);
    }

    public layout(width: number, height: number) {
        super.layout(width, height);
    }

    public dispose() {
        super.dispose();
    }
}