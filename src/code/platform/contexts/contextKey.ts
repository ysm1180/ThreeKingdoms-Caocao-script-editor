export class ContextKey<T> {
    private _value: T;

    constructor(defaultValue: T) {
        this._value = defaultValue;
    }

    public set(value: T) {
        this._value = value;
    }

    public get(): T {
        return this._value;
    }
}