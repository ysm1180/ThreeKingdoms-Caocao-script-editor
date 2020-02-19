import { createFastDomNode, FastDomNode } from '../../../base/browser/fastDomNode';
import { ViewportData } from '../../common/view/viewportData';
import { ViewLine } from './viewLine';

export class RenderedLinesCollection {
  private lines: ViewLine[];
  private lineNumberStart: number;

  constructor() {
    this.lines = [];
    this.lineNumberStart = 1;
  }

  public get(): { lineNumberStart: number; lines: ViewLine[] } {
    return {
      lines: this.lines,
      lineNumberStart: this.lineNumberStart,
    };
  }

  public getCount(): number {
    return this.lines.length;
  }

  public getLine(lineNumber: number): ViewLine {
    let lineIndex = lineNumber - this.lineNumberStart;
    if (lineIndex < 0 || lineIndex >= this.lines.length) {
      throw new Error('Illegal value for lineNumber');
    }
    return this.lines[lineIndex];
  }

  public set(lineNumberStart: number, lines: ViewLine[]): void {
    this.lines = lines;
    this.lineNumberStart = lineNumberStart;
  }

  public getStartLineNumber(): number {
    return this.lineNumberStart;
  }

  public getEndLineNumber(): number {
    return this.lineNumberStart + this.lines.length - 1;
  }
}

export class VisibleLines {
  private linesCollection: RenderedLinesCollection;
  private domNode: FastDomNode<HTMLElement>;

  constructor() {
    this.domNode = this._createDomNode();
    this.linesCollection = new RenderedLinesCollection();
  }

  private _createDomNode(): FastDomNode<HTMLElement> {
    const domNode = createFastDomNode(document.createElement('div'));
    domNode.setClassName('view-layer');
    domNode.setPosition('absolute');
    return domNode;
  }

  public renderLines(viewportData: ViewportData) {
    const lineData = this.linesCollection.get();
    const renderer = new ViewLayerRenderer(this.domNode.domNode, viewportData);

    const ctx: IRendererContext = {
      lines: lineData.lines,
      linesLength: lineData.lines.length,
      lineNumberStart: lineData.lineNumberStart,
    };

    const resCtx = renderer.render(ctx, viewportData.startLineNumber, viewportData.endLineNumber);

    this.linesCollection.set(resCtx.lineNumberStart, resCtx.lines);
  }

  public getDomNode(): FastDomNode<HTMLElement> {
    return this.domNode;
  }

  public getStartLineNumber(): number {
    return this.linesCollection.getStartLineNumber();
  }

  public getEndLineNumber(): number {
    return this.linesCollection.getEndLineNumber();
  }

  public getVisibleLine(lineNumber: number): ViewLine {
    return this.linesCollection.getLine(lineNumber);
  }
}

interface IRendererContext {
  lines: ViewLine[];
  linesLength: number;
  lineNumberStart: number;
}

export class ViewLayerRenderer {
  private viewportData: ViewportData;
  private domNode: HTMLElement;

  constructor(domNode: HTMLElement, viewportData: ViewportData) {
    this.domNode = domNode;
    this.viewportData = viewportData;
  }

  public render(ctx: IRendererContext, startLineNumber: number, endLineNumber: number): IRendererContext {
    let rendererContext: IRendererContext = {
      lines: ctx.lines.slice(0),
      linesLength: ctx.linesLength,
      lineNumberStart: ctx.lineNumberStart,
    };

    rendererContext.lines = [];
    rendererContext.linesLength = endLineNumber - startLineNumber + 1;
    for (let i = startLineNumber; i <= endLineNumber; i++) {
      rendererContext.lines[i - startLineNumber] = new ViewLine();
    }

    this._finishRendering(rendererContext);

    return rendererContext;
  }

  private _finishRendering(ctx: IRendererContext) {
    const lines = ctx.lines;
    const linesLength = ctx.linesLength;
    const lineNumberStart = ctx.lineNumberStart;

    let innerHTML = '';
    for (let i = 0; i < linesLength; i++) {
      const line = lines[i];

      innerHTML += line.renderLine(i + lineNumberStart, this.viewportData);
    }

    this._finishRenderingLines(ctx, innerHTML);
  }

  private _finishRenderingLines(ctx: IRendererContext, innerHTML: string) {
    this.domNode.innerHTML = innerHTML;

    let child = <HTMLElement>this.domNode.firstChild;
    for (let i = 0; i < ctx.linesLength; i++) {
      let line = ctx.lines[i];
      line.setDomNode(child);
      child = <HTMLElement>child.nextSibling;
    }
  }
}
