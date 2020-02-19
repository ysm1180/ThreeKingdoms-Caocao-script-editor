import { FastDomNode, createFastDomNode } from '../../../base/browser/fastDomNode';
import { ViewConfigurationChangedEvent, ViewEvent } from '../../common/view/viewEvents';

import { EditorConfiguration } from '../config/configuration';
import { EditorScrollbar } from '../viewParts/editorScrollbar';
import { ViewContext } from '../../common/view/viewContext';
import { ViewEventDispatcher } from '../../common/view/viewEventDispatcher';
import { ViewEventHandler } from '../../common/view/viewEventHandler';
import { ViewLines } from './viewLines';
import { ViewModel } from '../../common/viewModel/viewModel';
import { ViewPart } from './viewPart';
import { ViewportData } from '../../common/view/viewportData';

export class View extends ViewEventHandler {
  public domNode: FastDomNode<HTMLElement>;

  private scrollbar: EditorScrollbar;

  private linesContent: FastDomNode<HTMLElement>;
  private context: ViewContext;
  private viewLines: ViewLines;
  private viewParts: ViewPart[];

  private eventDispatcher: ViewEventDispatcher;

  constructor(configuration: EditorConfiguration, model: ViewModel) {
    super();

    this.eventDispatcher = new ViewEventDispatcher((callback: () => void) => this._renderOnce(callback));
    this.context = new ViewContext(configuration, model, this.eventDispatcher);

    this.viewParts = [];

    this._createViewParts();
    this._setLayout();

    this.registerDispose(
      model.addEventListener((events: ViewEvent[]) => {
        this.eventDispatcher.emitMany(events);
      })
    );
  }

  private _createViewParts() {
    this.linesContent = createFastDomNode(document.createElement('div'));
    this.linesContent.setClassName('lines-content');
    this.linesContent.setPosition('absolute');

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

  private _renderOnce(callback: () => any): any {
    let r = callback();
    this._actualRender();
    return r;
  }

  public render() {
    this._actualRender();
  }

  private _actualRender() {
    const viewportData = new ViewportData(1, this.context.model.getLineCount(), this.context.model);

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

    this.linesContent.setWidth(1000000);
    this.linesContent.setHeight(1000000);
  }

  public onConfigurationChanged(e: ViewConfigurationChangedEvent): boolean {
    if (e.layoutInfo) {
      this._setLayout();
    }

    return true;
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
