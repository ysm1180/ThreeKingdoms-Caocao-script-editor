import { VerticalScrollbar } from './verticalScrollbar';
import { HorizontalScrollbar } from './horizontalScrollbar';
import { Scroll, ScrollEvent } from 'code/base/common/scroll';
import { Disposable } from 'code/base/common/lifecycle';
import { Event } from 'code/base/common/event';

export interface ScrollableElementOptions {
	horizontalScrollbarSize: number;
	verticalScrollbarSize: number;
}

export class ScrollbarElement extends Disposable {
    private scroll: Scroll;
    private domNode: HTMLElement;
    private verticalScrollbar: VerticalScrollbar;
    private horizontalScrollbar: HorizontalScrollbar;

    public readonly onScroll = this.registerDispose(new Event<ScrollEvent>());
    
    constructor(element: HTMLElement, options: ScrollableElementOptions, scroll?: Scroll) {
        super();

        this.scroll = scroll;

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
}