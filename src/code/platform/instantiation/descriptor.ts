export class ClassDescriptor<T> {
    public readonly ctor: any;
    constructor(ctor: new (...args: any[]) => T) {
        this.ctor = ctor;
    }
}