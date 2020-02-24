import { IDisposable } from 'jojo/base/common/lifecycle';
import { TextModel } from 'jojo/editor/common/textModel';
import { ViewLineData } from 'jojo/editor/common/viewModel/viewModel';

export interface ILinesCollection extends IDisposable {
  getViewLineCount(): number;
  getViewLineContent(lineNumber: number): string;
  getViewLineData(lineNumber: number): ViewLineData;
}

export class LinesCollection implements ILinesCollection {
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
    return new ViewLineData(lineContent);
  }

  public dispose(): void {}
}
