import { $, DomBuilder } from 'code/base/browser/domBuilder';
import { IEditorInput } from 'code/platform/editor/editor';
import { BaseEditor } from 'code/editor/workbench/browser/parts/editor/baseEditor';
import { Image } from 'code/editor/browser/image';

export class ImageViewEditor extends BaseEditor {
    static ID = 'editor.imageviewer';

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
        if (!input) {
            this.image.attr('src', '');
            return;
        }

        input.resolve().then((data : { image: Image, music }) => {
            if (data.image) {
                const base64 = data.image.encodeToBase64();

                this.image.attr('src', `data:image/${data.image.type};base64,` + base64);
            }
        });
    }
}