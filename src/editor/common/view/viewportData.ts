import { ViewModel } from '../viewModel/viewModel';

export class ViewportData {
  public readonly startLineNumber: number;
  public readonly endLineNumber: number;

  private model: ViewModel;

  constructor(startLineNumber: number, endLineNumber: number, model: ViewModel) {
    this.model = model;
    this.startLineNumber = startLineNumber;
    this.endLineNumber = endLineNumber;
  }

  public getViewLineRenderingData(lineNumber: number) {
    return this.model.getViewLineRenderingData(lineNumber);
  }
}
