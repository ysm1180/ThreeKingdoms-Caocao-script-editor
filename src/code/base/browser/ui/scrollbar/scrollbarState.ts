const MINIMUM_SLIDER_SIZE = 20;

export class ScrollbarState {
    private visibleSize: number;
    private scrollSize: number;
    
    private scrollbarSize: number;
    private oppositeScrollbarSize: number;

    private computedAvailableSize: number;
    private computedSliderSize: number;

    constructor(scrollbarSize: number, oppositeScrollbarSize: number) {
        this.scrollbarSize = Math.round(scrollbarSize);
        this.oppositeScrollbarSize = Math.round(oppositeScrollbarSize);
        
        this.visibleSize = 0;
        this.scrollSize = 0;

        this._recomputedValues();
    }

    public setVisibleSize(visibleSize: number): boolean {
        const iVisibleSize = Math.round(visibleSize);
        if (this.visibleSize !== iVisibleSize) {
            this.visibleSize = iVisibleSize;
            this._recomputedValues();
            return true;
        }
        return false;
    }

    public setScrollSize(scrollSize: number): boolean {
        const iScrollSize = Math.round(scrollSize);
        if (this.scrollSize !== iScrollSize) {
            this.scrollSize = iScrollSize;
            this._recomputedValues();
            return true;
        }
        return false;
    }

    public getLargeSize(): number {
        return this.computedAvailableSize;
    }

    public getSmallSize(): number {
        return this.scrollbarSize;
    }

    public getSliderSize(): number {
        return this.computedSliderSize;
    }

    private _recomputedValues(): void {
        const computedAvailableSize = Math.max(0, this.visibleSize - this.oppositeScrollbarSize);

        if (this.scrollSize > 0) {
            const sliderSize = Math.max(MINIMUM_SLIDER_SIZE, Math.floor(this.visibleSize * this.computedAvailableSize / this.scrollSize));
            this.computedSliderSize = Math.round(sliderSize);
        }

        this.computedAvailableSize = Math.round(computedAvailableSize);
    }
}