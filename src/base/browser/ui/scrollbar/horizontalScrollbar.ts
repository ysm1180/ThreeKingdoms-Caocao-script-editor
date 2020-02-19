import { INewScrollPosition, Scroll, ScrollEvent } from '../../../common/scroll';

import { AbstractScrollbar } from './abstractScrollbar';
import { IMouseEvent } from '../../mouseEvent';
import { ScrollableElementOptions } from './scrollbarElement';
import { ScrollbarState } from './scrollbarState';

export class HorizontalScrollbar extends AbstractScrollbar {
  constructor(scroll: Scroll, options: ScrollableElementOptions) {
    super({
      extraClassName: 'horizontal',
      scrollbarState: new ScrollbarState(options.horizontalScrollbarSize, options.verticalScrollbarSize),
      scroll: scroll,
    });

    this._createSlider(0, 0, null, options.horizontalScrollbarSize);
  }

  protected _renderDomNode(largeSize: number, smallSize: number): void {
    this.domNode.setWidth(largeSize);
    this.domNode.setHeight(smallSize);
    this.domNode.setLeft(0);
    this.domNode.setBottom(0);
  }

  protected _updateSlider(sliderSize: number, sliderPosition: number): void {
    this.slider.setWidth(sliderSize);
    this.slider.setLeft(sliderPosition);
  }

  public onDidScroll(e: ScrollEvent) {
    this._onElementScrollSize(e.scrollWidth);
    this._onElementScrollPosition(e.scrollLeft);
    this._onElementVisibleSize(e.width);
  }

  public writeScrollPosition(target: INewScrollPosition, scrollPosition: number) {
    target.scrollLeft = scrollPosition;
  }

  protected _sliderMousePosition(e: IMouseEvent): number {
    return e.posx;
  }

  protected _mouseDownRelativePosition(offsetX: number, offsetY: number): number {
    return offsetX;
  }
}
