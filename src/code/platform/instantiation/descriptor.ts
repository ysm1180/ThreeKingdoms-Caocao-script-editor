export class ClassDescriptor<T> {
    public readonly ctor: any;
    public readonly staticArguments: any[];

    constructor(ctor: new (...args: any[]) => T, ..._staticArguments: any[]) {
        this.ctor = ctor;
        this.staticArguments = _staticArguments;
    }
}