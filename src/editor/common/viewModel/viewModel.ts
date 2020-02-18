import { EditorConfiguration } from '../../browser/config/configuration';
import { IConfigurationChangedEvent } from '../config/editorOptions';
import { TextModel } from '../textModel';
import {
    ViewConfigurationChangedEvent, ViewEventEmitter, ViewEventsCollector, ViewScrollChangedEvent
} from '../view/viewEvents';
import { ViewLayout } from '../viewLayout/viewLayout';
import { LinesCollection } from './linesCollection';

export class Viewport {
    readonly _viewportBrand: void;

    readonly top: number;
    readonly left: number;
    readonly width: number;
    readonly height: number;

    constructor(top: number, left: number, width: number, height: number) {
        this.top = top | 0;
        this.left = left | 0;
        this.width = width | 0;
        this.height = height | 0;
    }
}

export class ViewLineData {
    public readonly content: string;

    constructor(content: string) {
        this.content = content;
    }
}

export class ViewLineRenderingData {
    public readonly content: string;
    public readonly tabSize: number;
    constructor(content: string, tabSize: number) {
        this.content = content;
        this.tabSize = tabSize;
    }
}

export class ViewModel extends ViewEventEmitter {
    private model: TextModel;
    private lines: LinesCollection;
    private viewLayout: ViewLayout;
    private configuration: EditorConfiguration;

    constructor(configuration: EditorConfiguration, model: TextModel) {
        super();

        this.model = model;
        this.configuration = configuration;

        this.lines = new LinesCollection(this.model);

        const lineHeight = 19;
        this.viewLayout = new ViewLayout(
            this.configuration,
            this.getLineCount(),
            lineHeight
        );

        this.registerDispose(
            this.viewLayout.onDidScroll.add(e => {
                try {
                    const eventsCollector = this._beginEmit();
                    eventsCollector.emit(new ViewScrollChangedEvent(e));
                } finally {
                    this._endEmit();
                }
            })
        );

        this.registerDispose(
            this.configuration.onDidChange.add(e => {
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

    private _onConfigurationChanged(
        eventsCollector: ViewEventsCollector,
        e: IConfigurationChangedEvent
    ): void {
        eventsCollector.emit(new ViewConfigurationChangedEvent(e));
        this.viewLayout.onConfigurationChanged(e);
    }

    public dispose(): void {
        super.dispose();
        this.viewLayout.dispose();
    }
}
