export class ClassDescriptor<T> {
  public readonly ctor: any;
  public readonly staticArguments: any[];

  constructor(ctor: new (...args: any[]) => T, ..._staticArguments: any[]) {
    this.ctor = ctor;
    this.staticArguments = _staticArguments;
  }
}

export interface ClassDescriptor0<T> {
  ctor: any;
}
export interface ClassDescriptor1<A1, T> {
  ctor: any;
}
export interface ClassDescriptor2<A1, A2, T> {
  ctor: any;
}
export interface ClassDescriptor3<A1, A2, A3, T> {
  ctor: any;
}
export interface ClassDescriptor4<A1, A2, A3, A4, T> {
  ctor: any;
}
export interface ClassDescriptor5<A1, A2, A3, A4, A5, T> {
  ctor: any;
}
export interface ClassDescriptor6<A1, A2, A3, A4, A5, A6, T> {
  ctor: any;
}
export interface ClassDescriptor7<A1, A2, A3, A4, A5, A6, A7, T> {
  ctor: any;
}
export interface ClassDescriptor8<A1, A2, A3, A4, A5, A6, A7, A8, T> {
  ctor: any;
}
