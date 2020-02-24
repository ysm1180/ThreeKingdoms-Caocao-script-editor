import { EditorConfiguration } from 'jojo/editor/browser/config/configuration';
import { IConfigurationChangedEvent } from 'jojo/editor/common/config/editorOptions';
import { TextModel } from 'jojo/editor/common/textModel';
import {
  ViewConfigurationChangedEvent,
  ViewEventEmitter,
  ViewEventsCollector,
  ViewScrollChangedEvent,
} from 'jojo/editor/common/view/viewEvents';
import { ViewLayout } from 'jojo/editor/common/viewLayout/viewLayout';
import { ILinesCollection, LinesCollection } from 'jojo/editor/common/viewModel/linesCollection';
import { IViewModel, ViewLineRenderingData } from 'jojo/editor/common/viewModel/viewModel';

export class ViewModel extends ViewEventEmitter implements IViewModel {
  private model: TextModel;
  private lines: ILinesCollection;
  private viewLayout: ViewLayout;
  private configuration: EditorConfiguration;

  constructor(configuration: EditorConfiguration, model: TextModel) {
    super();

    this.model = model;
    this.configuration = configuration;

    this.lines = new LinesCollection(this.model);

    const lineHeight = 19;
    this.viewLayout = new ViewLayout(this.configuration, this.getLineCount(), lineHeight);

    this.registerDispose(
      this.viewLayout.onDidScroll.add((e) => {
        try {
          const eventsCollector = this._beginEmit();
          eventsCollector.emit(new ViewScrollChangedEvent(e));
        } finally {
          this._endEmit();
        }
      })
    );

    this.registerDispose(
      this.configuration.onDidChange.add((e) => {
        try {
          const eventsCollector = this._beginEmit();
          this._onConfigurationChanged(eventsCollector, e);
        } finally {
          this._endEmit();
        }
      })
    );
  }

  public getViewLayout(): ViewLayout {
    return this.viewLayout;
  }

  public getViewLineRenderingData(lineNumber: number): ViewLineRenderingData {
    const lineData = this.lines.getViewLineData(lineNumber);
    const tabSize = 4;

    return new ViewLineRenderingData(lineData.content, tabSize);
  }

  public getLineCount(): number {
    return this.lines.getViewLineCount();
  }

  private _onConfigurationChanged(eventsCollector: ViewEventsCollector, e: IConfigurationChangedEvent): void {
    eventsCollector.emit(new ViewConfigurationChangedEvent(e));
    this.viewLayout.onConfigurationChanged(e);
  }

  public dispose(): void {
    super.dispose();
    this.viewLayout.dispose();
  }
}
