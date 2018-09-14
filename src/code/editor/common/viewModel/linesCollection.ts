import { TextModel } from '../textModel';
import { ViewLineData } from './viewModel';

export class LinesCollection {
    private lines: string[];
    private model: TextModel;

    constructor(model: TextModel) {
        this.model = model;    
    }

    public getViewLineCount(): number {
        return this.model.getLineCount();
    }

    public getViewLineContent(lineNumber: number): string {
        return this.model.getLineContent(lineNumber);
    }

    public getViewLineData(lineNumber: number): ViewLineData {
        const lineContent = this.model.getLineContent(lineNumber);
        return new ViewLineData(
            lineContent
        );
    }
}