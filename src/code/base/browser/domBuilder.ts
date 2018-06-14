import { IDisposable, dispose } from 'code/base/common/lifecycle';
import { isString, isObject, isNullOrUndefined, isArray } from 'code/base/common/types';
import { isHtmlElement, createStyleSheetTag, addDisposableEventListener } from 'code/base/browser/dom';

export interface QuickDomBuilder {
    (): DomBuilder;
    (element: HTMLElement): DomBuilder;
    (window: Window): DomBuilder;
    (htmlOrQuerySyntax: string): DomBuilder;
    (builder: DomBuilder): DomBuilder;
}

export class Size {
    public width: number;
    public height: number;

    constructor(width: number, height: number) {
        this.width = width;
        this.height = height;
    }
}

export class DomBuilder {
    private container: HTMLElement;
    private currentElement: HTMLElement;
    private createdElements: HTMLElement[];

    private toUnbind: { [type: string]: IDisposable[] };

    constructor(element?: HTMLElement) {
        this.container = element;

        this.currentElement = element;
        this.createdElements = [];

        this.toUnbind = {};
    }

    public on(type: string, fn: (e) => void): DomBuilder {
        const unbind: IDisposable = addDisposableEventListener(this.currentElement, type, (e) => {
            fn(e);
        });

        if (!this.toUnbind[type]) {
            this.toUnbind[type] = [];
        }
        this.toUnbind[type].push(unbind);

        return this;
    }

    public once(type: string, fn: (e) => void): DomBuilder {
        const unbind: IDisposable = addDisposableEventListener(this.currentElement, type, (e) => {
            fn(e);
            unbind.dispose();
        });

        return this;
    }

    public off(type: string): DomBuilder {
        this.toUnbind[type] = dispose(this.toUnbind[type]);
        return this;
    }

    public build(container: DomBuilder): DomBuilder;
    public build(container: HTMLElement): DomBuilder;
    public build(container: any): DomBuilder {
        if (!container) {
            container = this.container;
        } else if (container instanceof DomBuilder) {
            container = (<DomBuilder>container).getHTMLElement();
        }

        const htmlContainer = <HTMLElement>container;
        if (htmlContainer) {
            for (let i = 0, len = this.createdElements.length; i < len; i++) {
                htmlContainer.appendChild(this.createdElements[i]);
            }
        }

        return this;
    }

    public append(child: HTMLElement) : DomBuilder;
    public append(child: DomBuilder) : DomBuilder;
    public append(child: any): DomBuilder {
        if (!isNullOrUndefined(child) && !isHtmlElement(child)) {
            child = (<DomBuilder>child).getHTMLElement();
        }

        this.getHTMLElement().appendChild(child);

        return this;
    }

    public appendTo(container: DomBuilder): DomBuilder;
    public appendTo(container: HTMLElement): DomBuilder;
    public appendTo(container: any): DomBuilder {
        if (!container) {
            container = this.container;
        } else if (container instanceof DomBuilder) {
            container = (<DomBuilder>container).getHTMLElement();
        }

        if (this.currentElement.parentNode) {
            this.currentElement.parentNode.removeChild(this.currentElement);
        }

        const htmlContainer = <HTMLElement>container;
        if (htmlContainer) {
            htmlContainer.appendChild(this.currentElement);
        }

        return this;
    }


    public getConatainer(): HTMLElement {
        return this.container;
    }

    public getHTMLElement(): HTMLElement {
        return this.currentElement;
    }

    public createElement(name: string, attributes?: any): DomBuilder {
        const element = document.createElement(name);
        this.currentElement = element;

        if (this.container === null) {
            this.createdElements.push(element);
        }

        if (isObject(attributes)) {
            this.attr(attributes);
        }

        if (this.container) {
            this.container.appendChild(element);
        }

        return this;
    }

    public html(): string;
    public html(value: string): DomBuilder;
    public html(value?: string): any {
        if (!isNullOrUndefined(value)) {
            this.currentElement.innerHTML = value;
            return this;
        }

        return this.currentElement.innerHTML;
    }

    public div(attributes?: any): DomBuilder {
        return this.createElement('div', attributes);
    }

    public img(attributes?: any): DomBuilder {
        return this.createElement('img', attributes);
    }

    public styleSheet(media = 'screen'): DomBuilder {
        const style = createStyleSheetTag(media);

        this.currentElement = style;
        if (this.container === null) {
            this.createdElements.push(style);
        } else {
            this.container.appendChild(style);
        }

        return this;
    }

    public style(name: string): string;
    public style(name: string, value: string): DomBuilder;
    public style(styles: any): DomBuilder;
    public style(firstArg: any, secondArg?: any): any {
        if (isObject(firstArg)) {
            for (const prop in firstArg) {
                if (firstArg.hasOwnProperty(prop)) {
                    const value = firstArg[prop];
                    this.setStyle(prop, value);
                }
            }

            return this;
        }

        if (isString(firstArg) && secondArg === null) {
            return this.currentElement.style[this.cssKeyToJavascriptProperty(firstArg)];
        }

        if (isString(firstArg)) {
            if (!isString(secondArg)) {
                secondArg = String(secondArg);
            }
            this.setStyle(firstArg, secondArg);
        }

        return this;
    }

    private cssKeyToJavascriptProperty(key: string): string {
        if (key.indexOf('-') >= 0) {
            const segments = key.split('-');
            key = segments[0];
            for (let i = 1; i < segments.length; i++) {
                const segment = segments[i];
                key = key + segment.charAt(0).toUpperCase() + segment.substr(1);
            }
        }

        return key;
    }

    public setStyle(key: string, value: string): void {
        this.currentElement.style[this.cssKeyToJavascriptProperty(key)] = value;
    }

    public attr(name: string);
    public attr(name: string, value: string);
    public attr(name: string, value: number);
    public attr(name: string, value: boolean);
    public attr(firstArg: any, secondArg?: any): any {
        if (isObject(firstArg)) {
            for (const prop in firstArg) {
                if (firstArg.hasOwnProperty(prop)) {
                    const value = firstArg[prop];
                    this.setAttr(prop, value);
                }
            }

            return this;
        }

        if (isString(firstArg) && secondArg === null) {
            return this.currentElement.getAttribute(firstArg);
        }

        if (isString(firstArg)) {
            if (!isString(secondArg)) {
                secondArg = String(secondArg);
            }
            this.setAttr(firstArg, secondArg);
        }

        return this;
    }

    private setAttr(prop: string, value: any): void {
        if (prop === 'class') {
            this.addClass(value);
        } else {
            this.currentElement.setAttribute(prop, value);
        }
    }

    public removeAttr(prop: string): void {
        this.currentElement.removeAttribute(prop);
    }

    public addClass(...classes: string[]): DomBuilder {
        classes.forEach((className: string) => {
            const names = className.split(' ');
            names.forEach((name: string) => {
                if (name) {
                    this.currentElement.classList.add(name);
                }
            });
        });

        return this;
    }

    public removeClass(...classes: string[]): DomBuilder {
        classes.forEach((className: string) => {
            const names = className.split(' ');
            names.forEach((name: string) => {
                if (name) {
                    this.currentElement.classList.remove(name);
                }
            });
        });

        return this;
    }

    public getClientArea(): Size {
        if (this.currentElement !== document.body) {
            return new Size(this.currentElement.clientWidth, this.currentElement.clientHeight);
        }

        if (window.innerWidth && window.innerHeight) {
            return new Size(window.innerWidth, window.innerHeight);
        }

        if (document.body && document.body.clientWidth && document.body.clientWidth) {
            return new Size(document.body.clientWidth, document.body.clientHeight);
        }

        if (document.documentElement && document.documentElement.clientWidth && document.documentElement.clientHeight) {
            return new Size(document.documentElement.clientWidth, document.documentElement.clientHeight);
        }

        return null;
    }

    public position(top: string, left?: string, bottom?: string, right?: string, position?: string): DomBuilder;
    public position(top: number, left?: number, bottom?: number, right?: number, position?: string): DomBuilder;
    public position(top: any, left?: any, bottom?: any, right?: any, position?: string): DomBuilder {
        if (!isNullOrUndefined(top)) {
            this.currentElement.style.top = this.toPixel(top);
        }
        if (!isNullOrUndefined(left)) {
            this.currentElement.style.left = this.toPixel(left);
        }
        if (!isNullOrUndefined(bottom)) {
            this.currentElement.style.bottom = this.toPixel(bottom);
        }
        if (!isNullOrUndefined(right)) {
            this.currentElement.style.right = this.toPixel(right);
        }

        if (isNullOrUndefined(position)) {
            position = 'absolute';
        }

        this.currentElement.style.position = position;


        return this;
    }

    public size(width: string, height?: string): DomBuilder;
    public size(width: number, height?: number): DomBuilder;
    public size(width: any, height?: any): DomBuilder {
        if (!isNullOrUndefined(width)) {
            this.currentElement.style.width = this.toPixel(width);
        }

        if (!isNullOrUndefined(height)) {
            this.currentElement.style.height = this.toPixel(height);
        }

        return this;
    }

    private toPixel(value: any): string {
        if (value.toString().indexOf('px') === -1) {
            return value.toString() + 'px';
        }

        return value;
    }

    public destroy(): void {
        if (this.currentElement) {
            if (this.currentElement.parentNode) {
                this.currentElement.parentNode.removeChild(this.currentElement);
            }

            if (this.container === null) {
                this.createdElements = [];
            }
        }

        for (const type in this.toUnbind) {
            if (this.toUnbind.hasOwnProperty(type) && isArray(this.toUnbind[type])) {
                this.toUnbind[type] = dispose(this.toUnbind[type]);
            }
        }

        this.currentElement = null;
        this.container = null;
        this.createdElements = null;
        this.toUnbind = null;
    }
}

const SELECTOR_REGEX = /([\w\-]+)?(#([\w\-]+))?((.([\w\-]+))*)/;

export const $: QuickDomBuilder = function (arg?: any): DomBuilder {
    if (arg === undefined) {
        return new DomBuilder(null);
    }

    if (!arg) {
        throw new Error('Bad use of $');
    }

    if (isHtmlElement(arg) || arg === window) {
        return new DomBuilder(arg);
    }

    if (arg instanceof DomBuilder) {
        return new DomBuilder((<DomBuilder>arg).getHTMLElement());
    }

    if (isString(arg)) {
        if (arg[0] === '<') {
            let element: Node;
            const container = document.createElement('div');
            container.innerHTML = arg;

            if (container.children.length === 0) {
                throw Error('Bad use of $');
            }

            if (container.children.length === 1) {
                element = container.firstChild;
                container.removeChild(element);
                return new DomBuilder(<HTMLElement>element);
            }
        } else {
            const match = SELECTOR_REGEX.exec(arg);
            if (!match) {
                throw new Error('Bad use of $');
            }

            const tag = match[1] || 'div';
            const id = match[3] || undefined;
            const classes = (match[4] || '').replace(/\./g, ' ');

            const props: any = {};
            if (id) {
                props['id'] = id;
            }

            if (classes) {
                props['class'] = classes;
            }

            return new DomBuilder(null).createElement(tag, props);
        }

    } else {
        throw new Error('Bad use of $');
    }
};