import { ITextBufferFactory } from '../../../common/models';
import { TextModel } from '../../../common/textModel';
import { IRawTextContent, ITextFileService } from './textfiles';

export class TextFileEditorModel {
  private _textModel: TextModel;

  constructor(private resource: string, @ITextFileService private textFileService: ITextFileService) {}

  public get model(): TextModel {
    return this._textModel;
  }

  public getResource(): string {
    return this.resource;
  }

  public load(): Promise<TextFileEditorModel> {
    return this.loadFromFile();
  }

  private loadFromFile(): Promise<TextFileEditorModel> {
    return this.textFileService.resolveTextContent(this.resource).then(
      (content) => this.doLoadWithContent(content),
      () => this.onHandleFailed()
    );
  }

  private doLoadWithContent(content: IRawTextContent) {
    return this.doCreateTextModel(content.value);
  }

  private doCreateTextModel(value: ITextBufferFactory): Promise<TextFileEditorModel> {
    this.doCreateTextEditorModel(value);

    return Promise.resolve(this);
  }

  private doCreateTextEditorModel(value: ITextBufferFactory): void {
    this._textModel = new TextModel(value);
  }

  private onHandleFailed() {
    console.log('failed');
    return null;
  }
}
