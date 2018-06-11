import { $, DomBuilder } from 'code/base/browser/domBuilder';
import { IEditorInput } from 'code/platform/editor/editor';
import { BaseEditor } from 'code/editor/workbench/browser/parts/editor/baseEditor';
import { ImageData } from 'code/editor/workbench/common/imageData';
import { AudioData } from 'code/editor/workbench/common/audioData';
import { Me5ItemType } from 'code/editor/workbench/parts/files/me5Data';
import { Audio } from 'code/base/browser/ui/audio';

export class Me5ItemViewEditor extends BaseEditor {
    static ID = 'editor.itemviewer';

    private viewer: DomBuilder;
    private audioContainer: DomBuilder;
    private audio: Audio;
    private imageContainer: DomBuilder;
    private image: DomBuilder;

    constructor(id: string) {
        super(id);

        this.audio = null;
    }

    public create(parent: DomBuilder) {
        super.create(parent);

        this.viewer = $().div({
            class: 'item-viewer-editor'
        });
        this.imageContainer = $(this.viewer).div({
            class: 'image-view'
        }).style('display', 'none');
        this.image = $(this.imageContainer).img({
            src: ''
        });

        this.audioContainer = $(this.viewer).div({
            class: 'audio-player',
        }).style('display', 'none');

        this.viewer.build(parent);
    }

    public setInput(input: IEditorInput) {
        if (!input) {
            this.imageContainer.style('display', 'none');
            this.audioContainer.style('display', 'none');
            return;
        }

        input.resolve().then((data : { type: Me5ItemType, image: ImageData, music: AudioData }) => {
            if (this.audio) {
                this.audio.dispose();
                this.audio = null;
            }

            if (data.type === Me5ItemType.Image) {
                

                const base64 = data.image.encodeToBase64();
                this.image.attr('src', `data:image/${data.image.type};base64,${base64}`);

                this.imageContainer.style('display', '');
                this.audioContainer.style('display', 'none');
            } else if (data.type === Me5ItemType.Music) {
                this.audio = new Audio(this.audioContainer.getHTMLElement());

                const base64 = data.music.encodeToBase64();
                this.audio.src =  `data:audio/${data.music.type};base64,${base64}`;
                
                this.audioContainer.style('display', '');
                this.imageContainer.style('display', 'none');
            }
        });
    }

    public dispoe() {
        this.audio.dispose();
        this.viewer.destroy();

        this.audio = null;

        super.dispose();
    }
}