import { Disposable } from '../../../base/common/lifecycle';
import { IDimension } from '../../common/editorCommon';

export class ElementSizeObserver extends Disposable {
    private referenceDomElement: HTMLElement;
    private width: number;
    private height: number;
    private changeCallback: () => void;

    constructor(referenceDomElement: HTMLElement, changeCallback: () => void) {
        super();

        this.referenceDomElement = referenceDomElement;
        this.width = -1;
        this.height = -1;
        this.changeCallback = changeCallback;
        this._measure(false);
    }

    public dispose(): void {}

    public getWidth(): number {
        return this.width;
    }

    public getHeight(): number {
        return this.height;
    }

    public observe(dimension?: IDimension): void {
        this._measure(true, dimension);
    }

    private _measure(
        callChangeCallback: boolean,
        dimension?: IDimension
    ): void {
        let width = 0;
        let height = 0;
        if (dimension) {
            width = dimension.width;
            height = dimension.height;
        } else if (this.referenceDomElement) {
            width = this.referenceDomElement.clientWidth;
            height = this.referenceDomElement.clientHeight;
        }

        width = Math.max(5, width);
        height = Math.max(5, height);

        if (this.width !== width || this.height !== height) {
            this.width = width;
            this.height = height;
            if (callChangeCallback) {
                this.changeCallback();
            }
        }
    }
}
