import { addDisposableEventListener } from 'jojo/base/browser/dom';
import { StandardMouseWheelEvent } from 'jojo/base/browser/mouseEvent';
import { HorizontalScrollbar } from 'jojo/base/browser/ui/scrollbar/horizontalScrollbar';
import { VerticalScrollbar } from 'jojo/base/browser/ui/scrollbar/verticalScrollbar';
import { Event } from 'jojo/base/common/event';
import { Disposable, IDisposable, dispose } from 'jojo/base/common/lifecycle';
import {
  INewScrollDimensions,
  INewScrollPosition,
  IScrollDimensions,
  IScrollPosition,
  Scroll,
  ScrollEvent,
} from 'jojo/base/common/scroll';

const SCROLL_WHEEL_SENSITIVITY = 50;

function resolveOptions(opts: ScrollableElementOptions): ScrollableElementOptions {
  const result: ScrollableElementOptions = {
    horizontalScrollbarSize: typeof opts.horizontalScrollbarSize !== 'undefined' ? opts.horizontalScrollbarSize : 14,
    verticalScrollbarSize: typeof opts.verticalScrollbarSize !== 'undefined' ? opts.verticalScrollbarSize : 14,
  };

  return result;
}

export interface ScrollableElementOptions {
  horizontalScrollbarSize?: number;
  verticalScrollbarSize?: number;
}

export class ScrollbarElement extends Disposable {
  protected scroll: Scroll;
  private domNode: HTMLElement;
  private verticalScrollbar: VerticalScrollbar;
  private horizontalScrollbar: HorizontalScrollbar;

  private mouseWheelToDispose: IDisposable[];

  public readonly onScroll = this.registerDispose(new Event<ScrollEvent>());

  constructor(element: HTMLElement, options: ScrollableElementOptions, scroll?: Scroll) {
    super();

    element.style.overflow = 'hidden';
    this.scroll = scroll;

    this.mouseWheelToDispose = [];

    this.registerDispose(
      this.scroll.onScroll.add((e) => {
        this._onDidScroll(e);
        this.onScroll.fire(e);
      })
    );

    options = resolveOptions(options);
    this.verticalScrollbar = new VerticalScrollbar(scroll, options);
    this.horizontalScrollbar = new HorizontalScrollbar(scroll, options);

    this.domNode = document.createElement('div');
    this.domNode.className = 'scrollable-element';
    this.domNode.style.overflow = 'hideen';
    this.domNode.appendChild(element);
    this.domNode.appendChild(this.verticalScrollbar.getDomNode().domNode);
    this.domNode.appendChild(this.horizontalScrollbar.getDomNode().domNode);

    this._setListeningToMouseWheel();
  }

  public getDomNode(): HTMLElement {
    return this.domNode;
  }

  public render(): void {
    this.verticalScrollbar.render();
    this.horizontalScrollbar.render();
  }

  private _onDidScroll(e: ScrollEvent): void {
    this.horizontalScrollbar.onDidScroll(e);
    this.verticalScrollbar.onDidScroll(e);

    this.render();
  }

  private _onMouseWheel(e: StandardMouseWheelEvent): void {
    if (e.deltaX || e.deltaY) {
      let deltaX = e.deltaX;
      let deltaY = e.deltaY;

      const shiftConvert = e.event && e.event.shiftKey;
      if (shiftConvert && !deltaX) {
        deltaX = deltaY;
        deltaY = 0;
      }

      const currentScrollPosition = this.scroll.getCurrentScrollPosition();
      let desiredScrollPosition: INewScrollPosition = {};
      if (deltaY) {
        const desiredScrollTop = currentScrollPosition.scrollTop - SCROLL_WHEEL_SENSITIVITY * deltaY;
        this.verticalScrollbar.writeScrollPosition(desiredScrollPosition, desiredScrollTop);
      }
      if (deltaX) {
        const desiredScrollLeft = currentScrollPosition.scrollLeft - SCROLL_WHEEL_SENSITIVITY * deltaX;
        this.verticalScrollbar.writeScrollPosition(desiredScrollPosition, desiredScrollLeft);
      }
      desiredScrollPosition = this.scroll.validateScrollPosition(desiredScrollPosition);

      if (
        currentScrollPosition.scrollLeft !== desiredScrollPosition.scrollLeft ||
        currentScrollPosition.scrollTop !== desiredScrollPosition.scrollTop
      ) {
        this.scroll.setScrollPositionNow(desiredScrollPosition);
      }
    }
  }

  private _setListeningToMouseWheel(): void {
    // Stop listening
    this.mouseWheelToDispose = dispose(this.mouseWheelToDispose);

    // Start listening
    const onMouseWheel = (browserEvent: MouseWheelEvent) => {
      const e = new StandardMouseWheelEvent(browserEvent);
      this._onMouseWheel(e);
    };

    this.mouseWheelToDispose.push(addDisposableEventListener(this.domNode, 'mousewheel', onMouseWheel));
    this.mouseWheelToDispose.push(addDisposableEventListener(this.domNode, 'DOMMouseScroll', onMouseWheel));
  }

  public getScrollDimensions(): IScrollDimensions {
    return this.scroll.getScrollDimensions();
  }

  public setScrollDimensions(dimensions: INewScrollDimensions): void {
    this.scroll.setScrollDimensions(dimensions);
  }
}

export class ScrollableElement extends ScrollbarElement {
  constructor(element: HTMLElement, options: ScrollableElementOptions) {
    options = options || {};

    const scroll = new Scroll();
    super(element, options, scroll);
    this.registerDispose(scroll);
  }

  public setScrollPosition(update: INewScrollPosition): void {
    this.scroll.setScrollPositionNow(update);
  }

  public getScrollPosition(): IScrollPosition {
    return this.scroll.getCurrentScrollPosition();
  }
}
