import { Disposable } from '../../../base/common/lifecycle';

export abstract class ViewPart extends Disposable {
    constructor() {
        super();
    }

    public abstract render(): void;
}