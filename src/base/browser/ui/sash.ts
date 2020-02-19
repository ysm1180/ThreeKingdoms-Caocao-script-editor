import { Event } from '../../common/event';
import { $, DomBuilder } from '../domBuilder';
import { StandardMouseEvent } from '../mouseEvent';

export enum Orientation {
  HORIZONTAL,
  VERTICAL,
}

export interface ISashLayoutProvider {}

export interface IVerticalSashLayoutProvider extends ISashLayoutProvider {
  getVerticalSashLeft(): number;
  getVerticalSashTop?(): number;
  getVerticalSashHeight?(): number;
}

export interface IHorizontalSashLayoutProvider extends ISashLayoutProvider {
  getHorizontalSashTop(): number;
  getHorizontalSashLeft?(): number;
  getHorizontalSashWidth?(): number;
}

export interface ISashOptions {
  orientation?: Orientation;
  size?: number;
}

export interface ISashEvent {
  startX: number;
  mouseX: number;
  startY: number;
  mouseY: number;
}

export class Sash {
  private element: DomBuilder;
  private orientation: Orientation;
  private size: number;
  private layoutProvider: ISashLayoutProvider;

  public readonly onDidStart = new Event<ISashEvent>();
  public readonly onDidChange = new Event<ISashEvent>();
  public readonly onDidEnd = new Event<void>();

  constructor(container: HTMLElement, layoutProvider: ISashLayoutProvider, options: ISashOptions = {}) {
    this.element = $('.sash').appendTo(container);
    this.size = options.size || 5;

    this.element.on('mousedown', (e) => this.onMouseDown(e as MouseEvent));

    this.setOrientation(options.orientation || Orientation.VERTICAL);

    this.layoutProvider = layoutProvider;
  }

  public onMouseDown(e: MouseEvent): void {
    const mouseEvent = new StandardMouseEvent(e);

    const startX = mouseEvent.posx;
    const startY = mouseEvent.posy;

    mouseEvent.preventDefault();
    mouseEvent.stopPropagation();

    const eventData: ISashEvent = {
      startX: startX,
      mouseX: startY,
      startY: startX,
      mouseY: startY,
    };
    this.onDidStart.fire(eventData);

    let styleHtml: string;
    if (this.orientation === Orientation.VERTICAL) {
      styleHtml = `* { cursor: ew-resize; }`;
    } else {
      styleHtml = `* { cursor: ns-resize; }`;
    }

    const styleContainer = $()
      .styleSheet()
      .html(styleHtml)
      .appendTo(this.element);

    const $window = $(window);
    $window
      .on('mousemove', (e) => {
        e.preventDefault();
        e.stopPropagation();

        const mouseEvent = new StandardMouseEvent(e);
        const eventData: ISashEvent = {
          startX,
          startY,
          mouseX: mouseEvent.posx,
          mouseY: mouseEvent.posy,
        };
        this.onDidChange.fire(eventData);
      })
      .once('mouseup', (e) => {
        e.preventDefault();
        e.stopPropagation();

        this.element.getHTMLElement().removeChild(styleContainer.getHTMLElement());

        this.onDidEnd.fire();

        $window.off('mousemove');
      });
  }

  public setOrientation(orientation: Orientation) {
    this.orientation = orientation;

    const orientationClass = this.orientation === Orientation.HORIZONTAL ? 'horizontal' : 'vertical';
    this.element.removeClass('horizontal', 'vertical');
    this.element.addClass(orientationClass);

    if (this.orientation === Orientation.HORIZONTAL) {
      this.element.size(null, this.size);
    } else {
      this.element.size(this.size);
    }

    if (this.layoutProvider) {
      this.layout();
    }
  }

  public layout() {
    let style: {
      left?: string;
      top?: string;
      width?: string;
      height?: string;
    };

    if (this.orientation === Orientation.HORIZONTAL) {
      const horizontalProvider = <IHorizontalSashLayoutProvider>this.layoutProvider;
      style = { top: horizontalProvider.getHorizontalSashTop() + 'px' };
      if (horizontalProvider.getHorizontalSashLeft) {
        style.left = horizontalProvider.getHorizontalSashLeft() + 'px';
      }
      if (horizontalProvider.getHorizontalSashWidth) {
        style.width = horizontalProvider.getHorizontalSashWidth() + 'px';
      }
    } else {
      const verticalProvider = <IVerticalSashLayoutProvider>this.layoutProvider;
      style = { left: verticalProvider.getVerticalSashLeft() + 'px' };
      if (verticalProvider.getVerticalSashTop) {
        style.top = verticalProvider.getVerticalSashTop() + 'px';
      }
      if (verticalProvider.getVerticalSashHeight) {
        style.height = verticalProvider.getVerticalSashHeight() + 'px';
      }
    }

    this.element.style(style);
  }

  public show(): void {
    this.element.show();
  }

  public hide(): void {
    this.element.hide();
  }
}
