import { ViewContext } from '../../common/view/viewContext';
import { FastDomNode } from '../../../base/browser/fastDomNode';
import { ViewportData } from '../../common/view/viewportData';
import { VisibleLines } from './viewLayer';
import { Disposable } from '../../../base/common/lifecycle';

export class ViewLines extends Disposable {
    private linesContent: FastDomNode<HTMLElement>;
    private context: ViewContext;
    private domNode: FastDomNode<HTMLElement>;
    private visibleLines: VisibleLines;

    private maxLineWidth: number;

    constructor(context: ViewContext, linesContent: FastDomNode<HTMLElement>) {
        super();

        this.context = context;
        this.linesContent = linesContent;  

        this.visibleLines = new VisibleLines();
        this.domNode = this.visibleLines.getDomNode();
        this.domNode.setClassName('view-lines');
        
        this.maxLineWidth = 0;
    }

    public getDomNode(): FastDomNode<HTMLElement> {
        return this.domNode;
    }

    public renderText(viewportData: ViewportData) {
        this.visibleLines.renderLines(viewportData);

        const maxHorizontalWidth = this._computeScrollWidth();
        this._ensureMaxLineWidth(maxHorizontalWidth);

        const top = this.context.viewLayout.scroll.getCurrentScrollPosition().scrollTop;
        this.linesContent.setTop(-top);
    }

    private _computeScrollWidth(): number {
        let result = 0;

        const startLineNumber = this.visibleLines.getStartLineNumber();
        const endLineNumber = this.visibleLines.getEndLineNumber();
        for (let lineNumber = startLineNumber; lineNumber <= endLineNumber; lineNumber++) {
            const width = this.visibleLines.getVisibleLine(lineNumber).getWidth();
            if (result < width) {
                result = width;
            }
        }

        return result;
    }

    private _ensureMaxLineWidth(lineWidth: number): void {
		let iLineWidth = Math.ceil(lineWidth);
		if (this.maxLineWidth < iLineWidth) {
			this.maxLineWidth = iLineWidth;
			this.context.viewLayout.onMaxLineWidthChanged(this.maxLineWidth);
		}
    }
    
    public dispose(): void {
        super.dispose();
    }
}