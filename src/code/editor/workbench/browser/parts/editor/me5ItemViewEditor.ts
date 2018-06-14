import { Event } from 'code/base/common/event';
import { $, DomBuilder } from 'code/base/browser/domBuilder';
import { IEditorInput } from 'code/platform/editor/editor';
import { BaseEditor } from 'code/editor/workbench/browser/parts/editor/baseEditor';
import { ImageData } from 'code/editor/workbench/common/imageData';
import { AudioData } from 'code/editor/workbench/common/audioData';
import { Me5ItemType } from 'code/editor/workbench/parts/files/me5Data';
import { AudioPlayer } from 'code/base/browser/ui/audio';
import { RawContextKey } from 'code/platform/contexts/contextKey';
import { ContextKey, IContextKeyService, ContextKeyService } from 'code/platform/contexts/contextKeyService';

export const Me5ActiveItemKey = 'me5ActiveItem';
const Me5ActiveItemContext = new RawContextKey<Me5ItemType>(Me5ActiveItemKey, Me5ItemType.Unknown);

export class Me5ItemViewEditor extends BaseEditor {
    static ID = 'editor.itemviewer';

    private viewer: DomBuilder;
    private audioContainer: DomBuilder;
    private audio: AudioPlayer;
    private imageContainer: DomBuilder;
    private image: DomBuilder;

    private itemContext: ContextKey<Me5ItemType>;

    public onDidChangeInput = new Event<void>();

    constructor(
        id: string,
        @IContextKeyService contextKeyService: ContextKeyService,
    ) {
        super(id);

        this.audio = null;

        this.itemContext = Me5ActiveItemContext.bindTo(contextKeyService);
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

    public setInput(input: IEditorInput): Promise<void> {
        if (!input) {
            this.imageContainer.style('display', 'none');
            this.audioContainer.style('display', 'none');
            return Promise.resolve();
        }

        return input.resolve().then((data: { type: Me5ItemType, image: ImageData, audio: AudioData }) => {
            if (this.audio) {
                this.audio.dispose();
                this.audio = null;
            }

            if (data.type === Me5ItemType.Image) {
                const base64 = data.image.encodeToBase64();
                this.image.attr('src', `data:image/${data.image.type};base64,${base64}`);

                this.imageContainer.style('display', '');
                this.audioContainer.style('display', 'none');

                this.itemContext.set(Me5ItemType.Image);
            } else if (data.type === Me5ItemType.Audio) {
                this.audio = new AudioPlayer(this.audioContainer.getHTMLElement());

                const base64 = data.audio.encodeToBase64();
                this.audio.src = `data:audio/${data.audio.type};base64,${base64}`;

                this.audioContainer.style('display', '');
                this.imageContainer.style('display', 'none');

                this.itemContext.set(Me5ItemType.Audio);
            } else {
                this.imageContainer.style('display', 'none');
                this.audioContainer.style('display', 'none');

                this.itemContext.set(Me5ItemType.Unknown);
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