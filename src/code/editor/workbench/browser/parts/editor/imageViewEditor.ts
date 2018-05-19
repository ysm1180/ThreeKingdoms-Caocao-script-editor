import { $, DomBuilder } from 'code/base/browser/domBuilder';
import { IEditorInput } from 'code/platform/editor/editor';
import { BaseEditor } from 'code/editor/workbench/browser/parts/editor/baseEditor';
import { Image } from 'code/editor/browser/image';

export class ImageViewEditor extends BaseEditor {
    private viewer: DomBuilder;
    private imageContainer: DomBuilder;
    private image: DomBuilder;

    constructor(id: string) {
        super(id);
    }

    public create(parent: DomBuilder) {
        super.create(parent);

        this.viewer = $().div({
            class: 'image-viewer-editor'
        });
        this.imageContainer = $(this.viewer).div({
            class: 'image'
        });
        this.image = $(this.imageContainer).img({
            src: ''
        });

        this.viewer.build(parent);
    }

    public setInput(input: IEditorInput) {
        input.resolve().then((data: Uint8Array) => {
            const image = new Image(data);
            const base64 = image.build();

            this.image.attr('src', ' data:image/png;base64,' + base64);
        });
    }
}