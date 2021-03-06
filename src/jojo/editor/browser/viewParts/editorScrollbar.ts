import { FastDomNode, createFastDomNode } from 'jojo/base/browser/fastDomNode';
import { ScrollableElementOptions, ScrollbarElement } from 'jojo/base/browser/ui/scrollbar/scrollbarElement';
import { ViewPart } from 'jojo/editor/browser/view/viewPart';
import { ViewContext } from 'jojo/editor/common/view/viewContext';
import { ViewConfigurationChangedEvent } from 'jojo/editor/common/view/viewEvents';

export class EditorScrollbar extends ViewPart {
  private scrollbar: ScrollbarElement;
  private scrollbarDomNode: FastDomNode<HTMLElement>;

  constructor(context: ViewContext, linesContent: FastDomNode<HTMLElement>) {
    super(context);

    const scrollbarOptions: ScrollableElementOptions = {};

    this.scrollbar = new ScrollbarElement(linesContent.domNode, scrollbarOptions, context.viewLayout.scroll);

    this.scrollbarDomNode = createFastDomNode(this.scrollbar.getDomNode());
    this.scrollbarDomNode.setPosition('absolute');
    this._setLayout();
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

  public onConfigurationChanged(e: ViewConfigurationChangedEvent): boolean {
    if (e.layoutInfo) {
      this._setLayout();
    }

    return true;
  }
}
