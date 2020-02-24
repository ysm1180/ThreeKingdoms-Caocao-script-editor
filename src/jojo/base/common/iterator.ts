export interface IIterator<T> {
  next(): T;
}

export interface IDoneIterator<T> {
  next(): { readonly done: boolean; readonly value: T; readonly node: any };
}

export class ArrayIterator<T> implements IIterator<T> {
  private items: T[];
  private start: number;
  private end: number;
  private currentIndex: number;

  constructor(items: T[], start = 0, end: number = items.length) {
    this.items = items;
    this.start = start;
    this.end = end;
    this.currentIndex = start - 1;
  }

  public next(): T {
    this.currentIndex = Math.min(this.currentIndex + 1, this.end);
    return this.current();
  }

  protected current(): T {
    if (this.currentIndex === this.start - 1 || this.currentIndex === this.end) {
      return null;
    }

    return this.items[this.currentIndex];
  }
}
