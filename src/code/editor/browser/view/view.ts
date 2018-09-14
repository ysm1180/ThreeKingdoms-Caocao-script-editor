import { createFastDomNode, FastDomNode } from '../../../base/browser/fastDomNode';
import { ViewContext } from '../../common/view/viewContext';
import { ViewLines } from './viewLines';
import { ViewportData } from '../../common/view/viewportData';
import { ViewModel } from '../../common/viewModel/viewModel';

export class View {
    public domNode: FastDomNode<HTMLElement>;

    private linesContent: FastDomNode<HTMLElement>;
    private context: ViewContext;
    private viewLines: ViewLines;

    constructor(
        model: ViewModel,
    ) {
        this.context = new ViewContext(model);

        this._createViewParts();
    }

    private _createViewParts() {
        this.linesContent = createFastDomNode(document.createElement('div'));
        this.linesContent.setClassName('lines-content');

        this.domNode = createFastDomNode(document.createElement('div'));
        this.domNode.setClassName(this._getEditorTheme());

        this.viewLines = new ViewLines(this.context, this.linesContent);

        this.linesContent.appendChild(this.viewLines.getDomNode());
        this.domNode.appendChild(this.linesContent);
    }

    private _getEditorTheme() {
        return 'theme-dark';
    }

    public render() {
        const viewportData = new ViewportData(
            1,
            this.context.model.getLineCount(),
            this.context.model
        );
        
        this.viewLines.renderText(viewportData);
    }
}