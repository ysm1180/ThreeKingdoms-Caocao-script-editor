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

export function toggleClass(node: HTMLElement, className: string, force?: boolean): void {
    if (className && node.classList) {
        node.classList.toggle(className, force);
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

export const EventType = {
	// Mouse
	CLICK: 'click',
	AUXCLICK: 'auxclick', // >= Chrome 56
	DBLCLICK: 'dblclick',
	MOUSE_UP: 'mouseup',
	MOUSE_DOWN: 'mousedown',
	MOUSE_OVER: 'mouseover',
	MOUSE_MOVE: 'mousemove',
	MOUSE_OUT: 'mouseout',
	CONTEXT_MENU: 'contextmenu',
	WHEEL: 'wheel',
	// Keyboard
	KEY_DOWN: 'keydown',
	KEY_PRESS: 'keypress',
	KEY_UP: 'keyup',
	// HTML Document
	LOAD: 'load',
	UNLOAD: 'unload',
	ABORT: 'abort',
	ERROR: 'error',
	RESIZE: 'resize',
	SCROLL: 'scroll',
	// Form
	SELECT: 'select',
	CHANGE: 'change',
	SUBMIT: 'submit',
	RESET: 'reset',
	FOCUS: 'focus',
	BLUR: 'blur',
	INPUT: 'input',
	// Local Storage
	STORAGE: 'storage',
	// Drag
	DRAG_START: 'dragstart',
	DRAG: 'drag',
	DRAG_ENTER: 'dragenter',
	DRAG_LEAVE: 'dragleave',
	DRAG_OVER: 'dragover',
	DROP: 'drop',
	DRAG_END: 'dragend',
};