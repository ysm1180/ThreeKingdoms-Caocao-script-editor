import { VerticalScrollbar } from './verticalScrollbar';
import { HorizontalScrollbar } from './horizontalScrollbar';
import { Scroll, ScrollEvent, INewScrollPosition } from 'code/base/common/scroll';
import { Disposable, dispose, IDisposable } from 'code/base/common/lifecycle';
import { Event } from 'code/base/common/event';
import { addDisposableEventListener } from '../../dom';
import { StandardMouseWheelEvent } from '../../mouseEvent';

const SCROLL_WHEEL_SENSITIVITY = 50;

export interface ScrollableElementOptions {
    horizontalScrollbarSize: number;
    verticalScrollbarSize: number;
}

export class ScrollbarElement extends Disposable {
    private scroll: Scroll;
    private domNode: HTMLElement;
    private verticalScrollbar: VerticalScrollbar;
    private horizontalScrollbar: HorizontalScrollbar;

    private mouseWheelToDispose: IDisposable[];

    public readonly onScroll = this.registerDispose(new Event<ScrollEvent>());

    constructor(element: HTMLElement, options: ScrollableElementOptions, scroll?: Scroll) {
        super();

        this.scroll = scroll;

        this.mouseWheelToDispose = [];

        this.registerDispose(this.scroll.onScroll.add((e) => {
            this._onDidScroll(e);
            this.onScroll.fire(e);
        }));

        this.verticalScrollbar = new VerticalScrollbar(scroll, options);
        this.horizontalScrollbar = new HorizontalScrollbar(scroll, options);

        this.domNode = document.createElement('div');
        this.domNode.className = 'scrollable-element';
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

            if (currentScrollPosition.scrollLeft !== desiredScrollPosition.scrollLeft || currentScrollPosition.scrollTop !== desiredScrollPosition.scrollTop) {
                this.scroll.setScrollPositionNow(desiredScrollPosition);
            }
        }
    }

    private _setListeningToMouseWheel(): void {
        // Stop listening
        this.mouseWheelToDispose = dispose(this.mouseWheelToDispose);

        // Start listening
        let onMouseWheel = (browserEvent: MouseWheelEvent) => {
            let e = new StandardMouseWheelEvent(browserEvent);
            this._onMouseWheel(e);
        };

        this.mouseWheelToDispose.push(addDisposableEventListener(this.domNode, 'mousewheel', onMouseWheel));
        this.mouseWheelToDispose.push(addDisposableEventListener(this.domNode, 'DOMMouseScroll', onMouseWheel));
    }
}