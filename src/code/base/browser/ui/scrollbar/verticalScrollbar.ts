import { AbstractScrollbar } from './scrollbar';
import { ScrollableElementOptions } from './scrollbarElement';
import { ScrollbarState } from './scrollbarState';
import { Scroll, ScrollEvent } from 'code/base/common/scroll';

export class VerticalScrollbar extends AbstractScrollbar {
    constructor(scroll: Scroll, options: ScrollableElementOptions) {
        super({
            extraClassName: 'vertical',
            scrollbarState: new ScrollbarState(
                options.verticalScrollbarSize,
                options.horizontalScrollbarSize
            ),
            scroll: scroll,
        });

        this._createSlider(0, 0, options.verticalScrollbarSize, null);
    }

    protected _renderDomNode(largeSize: number, smallSize: number): void {
        this.domNode.setHeight(largeSize);
        this.domNode.setWidth(smallSize);
        this.domNode.setRight(0);
        this.domNode.setTop(0);
    }

    protected _updateSlider(sliderSize: number): void {
        this.slider.setHeight(sliderSize);
    }

    public onDidScroll(e: ScrollEvent) {
        this._onElementScrollSize(e.scrollHeight);
        this._onElementVisibleSize(e.height);
    }
}