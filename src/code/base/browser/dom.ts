
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


export function isHtmlElement(element : any): element is HTMLElement {
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