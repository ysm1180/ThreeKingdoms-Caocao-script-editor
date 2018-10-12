import { Event } from './event';
import { Disposable } from './lifecycle';

export interface ScrollEvent {
	width: number;
	scrollWidth: number;
	scrollLeft: number;

	height: number;
	scrollHeight: number;
	scrollTop: number;

	widthChanged: boolean;
	scrollWidthChanged: boolean;
	scrollLeftChanged: boolean;

	heightChanged: boolean;
	scrollHeightChanged: boolean;
	scrollTopChanged: boolean;
}

export class ScrollState {
    public readonly width: number;
    public readonly scrollWidth: number;
    public readonly scrollLeft: number;
    public readonly height: number;
    public readonly scrollHeight: number;
    public readonly scrollTop: number;

    constructor(
        width: number,
        scrollWidth: number,
        scrollLeft: number,
        height: number,
        scrollHeight: number,
        scrollTop: number
    ) {
        this.width = width;
        this.scrollWidth = scrollWidth;
        this.scrollLeft = scrollLeft;
        this.height = height;
        this.scrollHeight = scrollHeight;
        this.scrollTop = scrollTop;
    }

    public equals(other: ScrollState): boolean {
        return (this.width === other.width &&
            this.scrollWidth === other.scrollWidth &&
            this.scrollLeft === other.scrollLeft &&
            this.height === other.height &&
            this.scrollHeight === other.scrollHeight &&
            this.scrollTop === other.scrollTop);
    }

    public withScrollDimensions(update: INewScrollDimensions): ScrollState {
		return new ScrollState(
			(typeof update.width !== 'undefined' ? update.width : this.width),
			(typeof update.scrollWidth !== 'undefined' ? update.scrollWidth : this.scrollWidth),
			this.scrollLeft,
			(typeof update.height !== 'undefined' ? update.height : this.height),
			(typeof update.scrollHeight !== 'undefined' ? update.scrollHeight : this.scrollHeight),
			this.scrollTop
		);
	}

	public withScrollPosition(update: INewScrollPosition): ScrollState {
		return new ScrollState(
			this.width,
			this.scrollWidth,
			(typeof update.scrollLeft !== 'undefined' ? update.scrollLeft : this.scrollLeft),
			this.height,
			this.scrollHeight,
			(typeof update.scrollTop !== 'undefined' ? update.scrollTop : this.scrollTop)
		);
	}

	public createScrollEvent(previous: ScrollState): ScrollEvent {
		let widthChanged = (this.width !== previous.width);
		let scrollWidthChanged = (this.scrollWidth !== previous.scrollWidth);
		let scrollLeftChanged = (this.scrollLeft !== previous.scrollLeft);

		let heightChanged = (this.height !== previous.height);
		let scrollHeightChanged = (this.scrollHeight !== previous.scrollHeight);
		let scrollTopChanged = (this.scrollTop !== previous.scrollTop);

		return {
			width: this.width,
			scrollWidth: this.scrollWidth,
			scrollLeft: this.scrollLeft,

			height: this.height,
			scrollHeight: this.scrollHeight,
			scrollTop: this.scrollTop,

			widthChanged: widthChanged,
			scrollWidthChanged: scrollWidthChanged,
			scrollLeftChanged: scrollLeftChanged,

			heightChanged: heightChanged,
			scrollHeightChanged: scrollHeightChanged,
			scrollTopChanged: scrollTopChanged,
		};
	}
}

export interface IScrollDimensions {
	readonly width: number;
	readonly scrollWidth: number;
	readonly height: number;
	readonly scrollHeight: number;
}

export interface INewScrollDimensions {
	width?: number;
	scrollWidth?: number;
	height?: number;
	scrollHeight?: number;
}

export interface IScrollPosition {
    readonly scrollLeft: number;
	readonly scrollTop: number;
}

export interface INewScrollPosition {
	scrollLeft?: number;
	scrollTop?: number;
}

export class Scroll extends Disposable {
    private state: ScrollState;

    public readonly onScroll = new Event<ScrollEvent>();

    constructor() {
        super();

        this.state = new ScrollState(0, 0, 0, 0, 0, 0);
    }

    public setScrollDimensions(dimensions: INewScrollDimensions): void {
		const newState = this.state.withScrollDimensions(dimensions);
		this._setState(newState);
    }
    
    public setScrollPositionNow(update: INewScrollPosition): void {
		const newState = this.state.withScrollPosition(update);
		this._setState(newState);
	}

    public getCurrentScrollPosition(): IScrollPosition {
		return this.state;
    }

    public getScrollDimensions(): IScrollDimensions {
		return this.state;
	}
    
    private _setState(newState: ScrollState): void {
        const oldState = this.state;
        if (oldState.equals(newState)) {
            return;
        }
        this.state = newState;
        this.onScroll.fire(this.state.createScrollEvent(oldState));
    }
}