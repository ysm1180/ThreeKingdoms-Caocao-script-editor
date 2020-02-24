import { FastDomNode, createFastDomNode } from 'jojo/base/browser/fastDomNode';
import { ViewportData } from 'jojo/editor/common/view/viewportData';
import { RenderLineInput, renderViewLine } from 'jojo/editor/common/viewLayout/viewLineRenderer';

export class ViewLine {
  private renderedViewLine: RenderedViewLine;

  constructor() {
    this.renderedViewLine = null;
  }

  public getDomNode(): HTMLElement {
    if (this.renderedViewLine && this.renderedViewLine.domNode) {
      return this.renderedViewLine.domNode.domNode;
    }
    return null;
  }

  public setDomNode(domNode: HTMLElement): void {
    if (this.renderedViewLine) {
      this.renderedViewLine.domNode = createFastDomNode(domNode);
    }
  }

  public renderLine(lineNumber: number, viewportData: ViewportData): string {
    const lineData = viewportData.getViewLineRenderingData(lineNumber);

    let html = '';
    const renderLineInput = new RenderLineInput(lineData.content, 4);

    // if (this.renderedViewLine && this.renderedViewLine.input.equels(renderLineInput)) {

    // }

    html += '<div class="view-line">';
    html += renderViewLine(renderLineInput);
    html += '</div>';

    this.renderedViewLine = new RenderedViewLine(
      this.renderedViewLine ? this.renderedViewLine.domNode : null,
      renderLineInput
    );

    return html;
  }

  public getWidth(): number {
    if (!this.renderedViewLine) {
      return 0;
    }
    return this.renderedViewLine.getWidth();
  }
}

export class RenderedViewLine {
  public readonly input: RenderLineInput;
  public domNode: FastDomNode<HTMLElement>;

  private _cacheWidth: number;

  constructor(domNode: FastDomNode<HTMLElement>, input: RenderLineInput) {
    this.domNode = domNode;
    this.input = input;

    this._cacheWidth = -1;
  }

  public getWidth(): number {
    if (this._cacheWidth === -1) {
      this._cacheWidth = (<HTMLElement>this.domNode.domNode.firstChild).offsetWidth;
    }
    return this._cacheWidth;
  }
}
