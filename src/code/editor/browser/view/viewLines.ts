import { ViewContext } from '../../common/view/viewContext';
import { FastDomNode } from '../../../base/browser/fastDomNode';
import { ViewportData } from '../../common/view/viewportData';
import { VisibleLines } from './viewLayer';
import { Disposable } from 'code/base/common/lifecycle';

export class ViewLines extends Disposable {
    private linesContent: FastDomNode<HTMLElement>;
    private context: ViewContext;
    private domNode: FastDomNode<HTMLElement>;
    private lines: VisibleLines;

    private maxLineWidth: number;

    constructor(context: ViewContext, linesContent: FastDomNode<HTMLElement>) {
        super();

        this.context = context;
        this.linesContent = linesContent;  

        this.lines = new VisibleLines();
        this.domNode = this.lines.getDomNode();
        this.domNode.setClassName('view-lines');
        this.maxLineWidth = 0;
    }

    public getDomNode(): FastDomNode<HTMLElement> {
        return this.domNode;
    }

    public renderText(viewportData: ViewportData) {
        this.lines.renderLines(viewportData);

    }

    private _ensureMaxLineWidth(lineWidth: number): void {
		let iLineWidth = Math.ceil(lineWidth);
		if (this.maxLineWidth !== iLineWidth) {
			this.maxLineWidth = iLineWidth;
			this.context.viewLayout.onMaxLineWidthChanged(this.maxLineWidth);
		}
    }
    
    public dispose(): void {
        super.dispose();
    }
}