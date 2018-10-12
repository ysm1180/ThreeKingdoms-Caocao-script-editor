import { FastDomNode, createFastDomNode } from '../../../base/browser/fastDomNode';
import { ScrollbarElement, ScrollableElementOptions } from '../../../base/browser/ui/scrollbar/scrollbarElement';
import { ViewPart } from '../view/viewPart';
import { ViewContext } from 'code/editor/common/view/viewContext';
import { IConfigurationChangedEvent } from 'code/editor/common/config/editorOptions';

export class EditorScrollbar extends ViewPart {
    private context: ViewContext;
    private scrollbar: ScrollbarElement;
    private scrollbarDomNode: FastDomNode<HTMLElement>;

    constructor(
        context: ViewContext,
        linesContent: FastDomNode<HTMLElement>
    ) {
        super();

        this.context = context;

        const scrollbarOptions: ScrollableElementOptions = {
            verticalScrollbarSize: 14,
            horizontalScrollbarSize: 14,
        };

        this.scrollbar = new ScrollbarElement(linesContent.domNode, scrollbarOptions, context.viewLayout.scroll);

        this.scrollbarDomNode = createFastDomNode(this.scrollbar.getDomNode());
        this.scrollbarDomNode.setPosition('absolute');
        this._setLayout();

        this.registerDispose(this.context.model.addEventListner((e) => {
            this.onConfigurationChanged(e);
        }));
    }

    public render(): void {
        this.scrollbar.render();
    }

    public getDomNode(): FastDomNode<HTMLElement> {
        return this.scrollbarDomNode;
    }

    private _setLayout(): void {
        const layoutInfo = this.context.configuration.editorOptions.layoutInfo;

        this.scrollbarDomNode.setLeft(layoutInfo.contentLeft);
        this.scrollbarDomNode.setWidth(layoutInfo.contentWidth);
        this.scrollbarDomNode.setHeight(layoutInfo.contentHeight);
    }

    public onConfigurationChanged(e: IConfigurationChangedEvent): void {
        if (e.layoutInfo) {
            this._setLayout();
        }
    }
    

}