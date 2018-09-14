import { ViewContext } from '../../common/view/viewContext';
import { FastDomNode, createFastDomNode } from '../../../base/browser/fastDomNode';
import { ViewportData } from '../../common/view/viewportData';
import { VisibleLines } from './viewLayer';

export class ViewLines {
    private linesContent: FastDomNode<HTMLElement>;
    private context: ViewContext;
    private domNode: FastDomNode<HTMLElement>;
    private lines: VisibleLines;

    constructor(context: ViewContext, linesContent: FastDomNode<HTMLElement>) {
        this.context = context;
        this.linesContent = linesContent;  
        this.lines = new VisibleLines();
        this.domNode = this.lines.getDomNode();

        this.domNode.setClassName('view-lines');
    }

    public getDomNode(): FastDomNode<HTMLElement> {
        return this.domNode;
    }

    public renderText(viewportData: ViewportData) {
        this.lines.renderLines(viewportData);
    }
}