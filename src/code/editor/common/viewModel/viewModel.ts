import { TextModel } from '../textModel';
import { LinesCollection } from './linesCollection';
import { ViewLayout } from '../viewLayout/viewLayout';

export class ViewLineData {
    public readonly content: string;

    constructor(
        content: string,
    ) {
        this.content = content;
    }
}

export class ViewLineRenderingData {
    public readonly content: string;
    public readonly tabSize: number;
    constructor(
        content: string,
        tabSize: number,
    ) {
        this.content = content;
        this.tabSize = tabSize;
    }
}

export class ViewModel {
    private model: TextModel;
    private lines: LinesCollection;
    private viewLayout: ViewLayout;

    constructor(
        model: TextModel,
    ) {
        this.model = model;
        this.lines = new LinesCollection(this.model);
    }

    public getViewLineRenderingData(lineNumber: number): ViewLineRenderingData {
        const lineData = this.lines.getViewLineData(lineNumber);
        const tabSize = 4;

        return new ViewLineRenderingData(
            lineData.content,
            tabSize
        );
    }

    public getLineCount(): number {
        return this.lines.getViewLineCount();
    }
}