import { createFastDomNode, FastDomNode } from '../../../base/browser/fastDomNode';
import { ViewContext } from '../../common/view/viewContext';
import { ViewLines } from './viewLines';
import { ViewportData } from '../../common/view/viewportData';
import { ViewModel } from '../../common/viewModel/viewModel';
import { ViewPart } from './viewPart';
import { EditorScrollbar } from '../viewParts/editorScrollbar';
import { EditorConfiguration } from '../config/configuration';
import { Disposable } from '../../../base/common/lifecycle';
import { IConfigurationChangedEvent } from '../../common/config/editorOptions';

export class View extends Disposable {
    public domNode: FastDomNode<HTMLElement>;

    private scrollbar: EditorScrollbar;

    private linesContent: FastDomNode<HTMLElement>;
    private context: ViewContext;
    private viewLines: ViewLines;
    private viewParts: ViewPart[];

    constructor(
        configuration: EditorConfiguration,
        model: ViewModel,
    ) {
        super();

        this.context = new ViewContext(configuration, model);

        this.viewParts = [];

        this._createViewParts();
        this._setLayout();

        this.registerDispose(model.addEventListner((e) => {
            this.onConfigurationChanged(e);
        }));
    }

    private _createViewParts() {
        this.linesContent = createFastDomNode(document.createElement('div'));
        this.linesContent.setClassName('lines-content');

        this.domNode = createFastDomNode(document.createElement('div'));
        this.domNode.setClassName(this._getEditorTheme());

        this.scrollbar = new EditorScrollbar(this.context, this.linesContent);
        this.viewParts.push(this.scrollbar);

        this.viewLines = new ViewLines(this.context, this.linesContent);

        this.linesContent.appendChild(this.viewLines.getDomNode());
        this.domNode.appendChild(this.scrollbar.getDomNode());
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

        for (let i = 0, len = this.viewParts.length; i < len; i++) {
            const viewPart = this.viewParts[i];
            viewPart.render();
        }
    }

    private _setLayout(): void {
        const layoutInfo = this.context.configuration.editorOptions.layoutInfo;
        this.domNode.setWidth(layoutInfo.contentWidth);
        this.domNode.setHeight(layoutInfo.contentHeight);
    }

    public onConfigurationChanged(e: IConfigurationChangedEvent): void {
        if (e.layoutInfo) {
            this._setLayout();
        }
    }

    public dispose(): void {
        this.viewLines.dispose();

        for (let i = 0, len = this.viewParts.length; i < len; i++) {
            this.viewParts[i].dispose();
        }
        this.viewParts = [];

        super.dispose();
    }
}