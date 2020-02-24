import { IViewModel } from 'jojo/editor/common/viewModel/viewModel';

export class ViewportData {
  public readonly startLineNumber: number;
  public readonly endLineNumber: number;

  private model: IViewModel;

  constructor(startLineNumber: number, endLineNumber: number, model: IViewModel) {
    this.model = model;
    this.startLineNumber = startLineNumber;
    this.endLineNumber = endLineNumber;
  }

  public getViewLineRenderingData(lineNumber: number) {
    return this.model.getViewLineRenderingData(lineNumber);
  }
}
