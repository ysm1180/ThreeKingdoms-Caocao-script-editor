import { FastDomNode, createFastDomNode } from '../../fastDomNode';
import { ScrollbarState } from './scrollbarState';
import { Scroll } from 'code/base/common/scroll';
import { Widget } from '../widget';

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
    }

    public getDomNode(): FastDomNode<HTMLElement> {
        return this.domNode;
    }

    public render(): void {
        this._render();
    }

    private _render(): void {
        this._renderDomNode(this.scrollbarState.getLargeSize(), this.scrollbarState.getSmallSize());
        this._updateSlider(this.scrollbarState.getSliderSize());
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

    protected abstract _updateSlider(sliderSize: number): void;
    protected abstract _renderDomNode(largeSize: number, smallSize: number): void;
}