import { FastDomNode, createFastDomNode } from '../../fastDomNode';
import { ScrollbarState } from './scrollbarState';
import { Widget } from '../widget';
import { IMouseEvent, StandardMouseEvent } from '../../mouseEvent';
import { Scroll, INewScrollPosition } from '../../../common/scroll';
import { addDisposableEventListener, EventType } from '../../dom';
import { dispose } from '../../../common/lifecycle';

export interface AbstractScrollbarOptions {
    extraClassName: string;
    scrollbarState: ScrollbarState;
    scroll: Scroll;
}

export abstract class AbstractScrollbar extends Widget {
    protected domNode: FastDomNode<HTMLElement>;
    protected slider: FastDomNode<HTMLElement>;
    protected scroll: Scroll;

    private scrollbarState: ScrollbarState;

    constructor(opts: AbstractScrollbarOptions) {
        super();

        this.scrollbarState = opts.scrollbarState;
        this.scroll = opts.scroll;

        this.domNode = createFastDomNode(document.createElement('div'));
        this.domNode.setClassName('scrollbar ' + opts.extraClassName);
        this.domNode.setPosition('absolute');

        this.onmousedown(this.domNode.domNode, (e) => this._domNodeMouseDown(e));
    }

    protected _createSlider(top: number, left: number, width: number, height: number): void {
        this.slider = createFastDomNode(document.createElement('div'));
        this.slider.setClassName('slider');
        this.slider.setPosition('absolute');
        this.slider.setTop(top);
        this.slider.setLeft(left);
        this.slider.setWidth(width);
        this.slider.setHeight(height);

        this.domNode.appendChild(this.slider);

        this.onmousedown(this.slider.domNode, (e) => {
            if (e.leftButton) {
                e.preventDefault();
                this._sliderMouseDown(e);
            }
        });
    }

    public getDomNode(): FastDomNode<HTMLElement> {
        return this.domNode;
    }

    public render(): void {
        this._render();
    }

    private _render(): void {
        this._renderDomNode(this.scrollbarState.getLargeSize(), this.scrollbarState.getSmallSize());
        this._updateSlider(this.scrollbarState.getSliderSize(), this.scrollbarState.getSliderPosition());
    }

    protected _onElementVisibleSize(visibleSize: number) {
        if (this.scrollbarState.setVisibleSize(visibleSize)) {
            this.render();
        }
    }

    protected _onElementScrollSize(elementScrollSize: number) {
        if (this.scrollbarState.setScrollSize(elementScrollSize)) {
            this.render();
        }
    }

    protected _onElementScrollPosition(elementScrollPosition: number) {
        if (this.scrollbarState.setScrollPosition(elementScrollPosition)) {
            this.render();
        }
    }

    private _onMouseDown(e: IMouseEvent): void {
        let offsetX: number;
        let offsetY: number;

        offsetX = e.event.offsetX;
        offsetY = e.event.offsetY;

        this._setDesiredScrollPositionNow(this.scrollbarState.getDesiredScrollPositionFromOffset(this._mouseDownRelativePosition(offsetX, offsetY)));
    }

    private _domNodeMouseDown(e: IMouseEvent): void {
        if (e.target !== this.domNode.domNode) {
            return;
        }
        this._onMouseDown(e);
    }

    private _sliderMouseDown(e: IMouseEvent): void {
        const initialScrollState = this.scrollbarState.clone();
		const initialMousePosition = this._sliderMousePosition(e);
		this.slider.toggleClassName ('active', true);

        const unbind = [];
        unbind.push(addDisposableEventListener(window.document, EventType.MOUSE_MOVE, (event: MouseEvent) => {
            const standardMouseEvent = new StandardMouseEvent(event);
            const mousePosition = this._sliderMousePosition(standardMouseEvent);
            const mouseDelta = mousePosition - initialMousePosition;
            this._setDesiredScrollPositionNow(initialScrollState.getDesiredScrollPositionFromDelta(mouseDelta));
            console.log(mouseDelta);
        }));
        unbind.push(addDisposableEventListener(window.document, EventType.MOUSE_UP, (event) => {
            this.slider.toggleClassName('active', false);
            dispose(unbind);
        }));
    }
    
    private _setDesiredScrollPositionNow(_desiredScrollPosition: number): void {
		let desiredScrollPosition: INewScrollPosition = {};
		this.writeScrollPosition(desiredScrollPosition, _desiredScrollPosition);

		this.scroll.setScrollPositionNow(desiredScrollPosition);
	}

    protected abstract _updateSlider(sliderSize: number, sliderPosition: number): void;
    protected abstract _renderDomNode(largeSize: number, smallSize: number): void;
    protected abstract _sliderMousePosition(e: IMouseEvent): number;
    protected abstract _mouseDownRelativePosition(offsetX: number, offsetY: number): number;

    public abstract writeScrollPosition(target: INewScrollPosition, scrollPosition: number): void;
}