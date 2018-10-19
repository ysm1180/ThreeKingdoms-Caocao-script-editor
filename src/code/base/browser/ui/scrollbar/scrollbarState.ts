const MINIMUM_SLIDER_SIZE = 20;

export class ScrollbarState {
    private visibleSize: number;
    private scrollSize: number;
    private scrollPosition: number;

    private scrollbarSize: number;
    private oppositeScrollbarSize: number;

    private computedAvailableSize: number;
    private computedSliderSize: number;
    private computedSliderPosition: number;

    constructor(scrollbarSize: number, oppositeScrollbarSize: number) {
        this.scrollbarSize = Math.round(scrollbarSize);
        this.oppositeScrollbarSize = Math.round(oppositeScrollbarSize);

        this.visibleSize = 0;
        this.scrollSize = 0;

        this.computedAvailableSize = 0;
        this.computedSliderSize = 0;
        this.computedSliderPosition = 0;

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

    public setScrollPosition(scrollPosition: number): boolean {
        const iScrollPosition = Math.round(scrollPosition);
        if (this.scrollPosition !== iScrollPosition) {
            this.scrollPosition = iScrollPosition;
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

    public getSliderPosition(): number {
        return this.computedSliderPosition;
    }

    private _recomputedValues(): void {
        this.computedAvailableSize = Math.round(Math.max(0, this.visibleSize - this.oppositeScrollbarSize));
        const computedIsNeeded = (this.scrollSize > 0 && this.scrollSize > this.visibleSize);

        if (!computedIsNeeded) {
            this.computedSliderSize = 0;
            this.computedSliderPosition = 0;
            return;
        }

        const sliderSize = Math.max(MINIMUM_SLIDER_SIZE, Math.floor(this.visibleSize * this.computedAvailableSize / this.scrollSize));
        this.computedSliderSize = Math.round(sliderSize);

        const computedSliderRatio = (this.computedAvailableSize - this.computedSliderSize) / (this.scrollSize - this.visibleSize);
        this.computedSliderPosition = Math.round(this.scrollPosition * computedSliderRatio);
    }
}