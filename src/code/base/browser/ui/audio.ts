import { $, DomBuilder } from 'code/base/browser/domBuilder';
import { Disposable, IDisposable, dispose } from 'code/base/common/lifecycle';
import { addDisposableEventListener, removeClass, addClass } from 'code/base/browser/dom';
import { StandardMouseEvent } from '../mouseEvent';

export class AudioPlayer extends Disposable {
    private parent: HTMLElement;
    private container: HTMLElement;
    private playButton: HTMLElement;
    private timeline: HTMLElement;
    private progress: DomBuilder;

    private elapsedLabel: HTMLElement;
    private durationLabel: HTMLElement;

    private _audio: HTMLAudioElement;

    private paused: boolean;

    private disposed: boolean;

    constructor(parent: HTMLElement) {
        super();

        this.parent = parent;

        this.container = document.createElement('div');
        this.container.className = 'audio-track';

        this._audio = document.createElement('audio');
        this.container.appendChild(this._audio);

        this.playButton = document.createElement('div');
        this.playButton.className = 'audio-button play';
        this.container.appendChild(this.playButton);

        this.durationLabel = document.createElement('span');
        this.durationLabel.className = 'audio-duration';
        this.container.appendChild(this.durationLabel);

        this.elapsedLabel = document.createElement('span');
        this.elapsedLabel.className = 'audio-elapsed';
        this.container.appendChild(this.elapsedLabel);

        this.timeline = document.createElement('div');
        this.timeline.className = 'audio-timeline';
        this.container.appendChild(this.timeline);

        this.progress = $().div({
            class: 'audio-progress',
        }).appendTo(this.timeline);

        parent.appendChild(this.container);

        this.registerDispose(
            addDisposableEventListener(this._audio, 'canplaythrough', () => {
                this.durationLabel.textContent = this.toTime(this._audio.duration);
            })
        );
        this.registerDispose(
            addDisposableEventListener(this.playButton, 'click', () => this.onPlayPause())
        );
        this.registerDispose(
            addDisposableEventListener(this._audio, 'timeupdate', () => this.onTimeUpdate())
        );
        this.registerDispose(
            addDisposableEventListener(this.timeline, 'mousedown', (e: MouseEvent) => this.onMovePlayHead(e))
        );

        this.paused = true;
    }

    private toTime(second: number): string {
        second = Math.floor(second);

        let miniteString = `${Math.floor(second / 60)}`;
        if (miniteString.length === 1) {
            miniteString = `0${miniteString}`;
        }

        let secondString = `${second % 60}`;
        if (secondString.length === 1) {
            secondString = `0${secondString}`;
        }

        return `${miniteString}:${secondString}`;
    }

    public set src(value: string) {
        this.pause();
        this._audio.currentTime = 0;
        this._audio.src = value;
    }

    public play(): void {
        this._audio.play();
        this.paused = false;

        removeClass(this.playButton, 'play');
        addClass(this.playButton, 'pause');
    }

    public pause(): void {
        this._audio.pause();
        this.paused = true;

        removeClass(this.playButton, 'pause');
        addClass(this.playButton, 'play');
    }

    public stop(): void {
        this._audio.currentTime = 0;
        this.pause();
    }

    private onPlayPause() {
        if (this.paused) {
            this.play();
        } else {
            this.pause();
        }
    }

    private onTimeUpdate() {
        const width = this.timeline.offsetWidth * (this._audio.currentTime / this._audio.duration);
        this.progress.size(width);

        this.elapsedLabel.textContent = this.toTime(this._audio.currentTime);

        if (Math.floor(this._audio.currentTime) === Math.floor(this._audio.duration)) {
            this.stop();
        }
    }

    private onMovePlayHead(event: MouseEvent) {
        const mouseEvent = new StandardMouseEvent(event);

        const unbind: IDisposable[] = [];

        unbind.push(addDisposableEventListener(this.timeline, 'mousemove', (e: MouseEvent) => {
            const mouseEvent = new StandardMouseEvent(e);

            this._audio.currentTime = this._audio.duration * ((mouseEvent.posx - this.timeline.getBoundingClientRect().left) / this.timeline.offsetWidth);
        }));

        unbind.push(addDisposableEventListener(this.timeline, 'mouseup', () => {
            dispose(unbind);
        }));

        this._audio.currentTime = this._audio.duration * ((mouseEvent.posx - this.timeline.getBoundingClientRect().left) / this.timeline.offsetWidth);
    }

    public dispose() {
        if (!this.disposed) {
            this._audio.pause();
            this.parent.removeChild(this.container);
    
            super.dispose();
    
            this.disposed = true;
        }
    }
}