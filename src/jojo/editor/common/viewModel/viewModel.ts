import { IDisposable } from 'jojo/base/common/lifecycle';
import { ViewEvent } from 'jojo/editor/common/view/viewEvents';
import { ViewLayout } from 'jojo/editor/common/viewLayout/viewLayout';

export class Viewport {
  readonly _viewportBrand: void;

  readonly top: number;
  readonly left: number;
  readonly width: number;
  readonly height: number;

  constructor(top: number, left: number, width: number, height: number) {
    this.top = top | 0;
    this.left = left | 0;
    this.width = width | 0;
    this.height = height | 0;
  }
}

export class ViewLineData {
  public readonly content: string;

  constructor(content: string) {
    this.content = content;
  }
}

export class ViewLineRenderingData {
  public readonly content: string;
  public readonly tabSize: number;
  constructor(content: string, tabSize: number) {
    this.content = content;
    this.tabSize = tabSize;
  }
}

export interface IViewModel {
  addEventListener(listener: (events: ViewEvent[]) => void): IDisposable;

  getViewLayout(): ViewLayout;

  getViewLineRenderingData(lineNumber: number): ViewLineRenderingData;

  getLineCount(): number;
}
