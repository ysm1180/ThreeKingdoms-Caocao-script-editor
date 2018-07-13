import { IDisposable } from '../common/lifecycle';

export class DomListener implements IDisposable {
    private _listener: (e: any) => void;
    private _node: Element | Window | Document;
    private readonly _type: string;

    constructor(node: Element | Window | Document, type: string, listener: (e: any) => void) {
        this._node = node;
        this._listener = listener;
        this._type = type;
        this._node.addEventListener(this._type, this._listener);
    }

    public dispose(): void {
        if (!this._listener) {
            return;
        }

        this._node.removeEventListener(this._type, this._listener);

        this._node = null;
        this._listener = null;
    }
}

export function hasClass(node: HTMLElement, className: string): boolean {
    return className && node.classList && node.classList.contains(className);
}

export function addClass(node: HTMLElement, className: string): void {
    if (className && node.classList) {
        node.classList.add(className);
    }
}

export function removeClass(node: HTMLElement, className: string): void {
    if (className && node.classList) {
        node.classList.remove(className);
    }
}

export function toggleClass(node: HTMLElement, className: string): void {
    if (className && node.classList) {
        node.classList.toggle(className);
    }
}


export function isHtmlElement(element: any): element is HTMLElement {
    if (typeof HTMLElement === 'object') {
        return element instanceof HTMLElement;
    }

    return element && typeof element === 'object' && element.nodeType === 1 && typeof element.nodeName === 'string';
}

export function createStyleSheetTag(media: string): HTMLStyleElement {
    const style = document.createElement('style');
    style.type = 'text/css';
    style.media = media;
    return style;
}

export function addDisposableEventListener(node: Element | Window | Document, type: string, fn: (e: any) => void): IDisposable {
    return new DomListener(node, type, fn);
}