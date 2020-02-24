export function once<T extends Function>(this: any, fn: T): T {
  const _this = this;
  let didCall = false;
  let result: any;

  return (function() {
    if (didCall) {
      return result;
    }

    didCall = true;
    result = fn.apply(_this, arguments);

    return result;
  } as any) as T;
}

export interface IDisposable {
  dispose(): void;
}

export function dispose<T extends IDisposable>(disposable: T): T;
export function dispose<T extends IDisposable>(...disposables: T[]): T[];
export function dispose<T extends IDisposable>(disposables: T[]): T[];
export function dispose<T extends IDisposable>(first: T | T[], ...rest: T[]): T | T[] {
  if (Array.isArray(first)) {
    first.forEach((item) => item && item.dispose());
    return [];
  } else if (rest.length === 0) {
    if (first) {
      first.dispose();
      return first;
    }
    return undefined;
  } else {
    dispose(first);
    dispose(rest);
    return [];
  }
}

export function combinedDisposable(disposables: IDisposable[]): IDisposable {
  return { dispose: (): IDisposable[] => dispose(disposables) };
}

export function toDisposable(...fns: (() => void)[]): IDisposable {
  return {
    dispose(): void {
      for (const fn of fns) {
        fn();
      }
    },
  };
}

export class Disposable implements IDisposable {
  private toDispose: IDisposable[];

  constructor() {
    this.toDispose = [];
  }

  public dispose(): void {
    this.toDispose = dispose(this.toDispose);
  }

  protected registerDispose<T extends IDisposable>(t: T): T {
    this.toDispose.push(t);
    return t;
  }
}
