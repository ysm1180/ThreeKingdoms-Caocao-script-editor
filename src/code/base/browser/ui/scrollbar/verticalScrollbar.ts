import { AbstractScrollbar } from './abstractScrollbar';
import { ScrollableElementOptions } from './scrollbarElement';
import { ScrollbarState } from './scrollbarState';
import { Scroll, ScrollEvent, INewScrollPosition } from '../../../../base/common/scroll';
import { IMouseEvent } from '../../mouseEvent';

export class VerticalScrollbar extends AbstractScrollbar {
    constructor(scroll: Scroll, options: ScrollableElementOptions) {
        super({
            extraClassName: 'vertical',
            scrollbarState: new ScrollbarState(
                options.verticalScrollbarSize,
                0
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

    protected _updateSlider(sliderSize: number, sliderPosition: number): void {
        this.slider.setHeight(sliderSize);
        this.slider.setTop(sliderPosition);
    }

    public onDidScroll(e: ScrollEvent) {
        this._onElementScrollSize(e.scrollHeight);
        this._onElementScrollPosition(e.scrollTop);
        this._onElementVisibleSize(e.height);
    }

    public writeScrollPosition(target: INewScrollPosition, scrollPosition: number) {
        target.scrollTop = scrollPosition;
    }

    protected _sliderMousePosition(e: IMouseEvent): number {
		return e.posy;
    }
    
    protected _mouseDownRelativePosition(offsetX: number, offsetY: number): number {
		return offsetY;
	}
}