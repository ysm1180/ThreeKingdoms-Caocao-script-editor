import { Event } from 'jojo/base/common/event';
import { Disposable } from 'jojo/base/common/lifecycle';
import { Scroll, ScrollEvent } from 'jojo/base/common/scroll';
import { EditorConfiguration } from 'jojo/editor/browser/config/configuration';
import { LinesLayout } from 'jojo/editor/common/viewLayout/linesLayout';
import { Viewport } from 'jojo/editor/common/viewModel/viewModel';

export class ViewLayout extends Disposable {
  private configuration: EditorConfiguration;
  private linesLayout: LinesLayout;

  public readonly scroll: Scroll;
  public readonly onDidScroll: Event<ScrollEvent>;

  constructor(configuration: EditorConfiguration, lineCount: number, lineHeight: number) {
    super();

    this.configuration = configuration;
    this.linesLayout = new LinesLayout(lineCount, lineHeight);

    this.scroll = new Scroll();

    this.scroll.setScrollDimensions({
      width: configuration.editorOptions.layoutInfo.contentWidth,
      height: configuration.editorOptions.layoutInfo.contentHeight,
    });
    this.onDidScroll = this.scroll.onScroll;

    this._updateHeight();
  }

  private _getTotalHeight(): number {
    const scrollDimensions = this.scroll.getScrollDimensions();

    let result = this.linesLayout.getLinesTotalHeight();

    return Math.max(scrollDimensions.height, result);
  }

  private _updateHeight(): void {
    this.scroll.setScrollDimensions({
      scrollHeight: this._getTotalHeight(),
    });
  }

  public onMaxLineWidthChanged(maxLineWidth: number): void {
    this.scroll.setScrollDimensions({
      scrollWidth: maxLineWidth,
    });

    this._updateHeight();
  }

  public onConfigurationChanged(e): void {
    this.scroll.setScrollDimensions({
      width: this.configuration.editorOptions.layoutInfo.contentWidth,
      height: this.configuration.editorOptions.layoutInfo.contentHeight,
    });

    this._updateHeight();
  }

  public getCurrnetViewport(): Viewport {
    const scrollDimensions = this.scroll.getScrollDimensions();
    const currentScrollPosition = this.scroll.getCurrentScrollPosition();
    return new Viewport(
      currentScrollPosition.scrollTop,
      currentScrollPosition.scrollLeft,
      scrollDimensions.width,
      scrollDimensions.height
    );
  }
}
