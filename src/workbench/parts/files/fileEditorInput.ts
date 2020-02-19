import * as path from 'path';

import { IEditorInput } from '../../../platform/editor/editor';
import { Files } from '../../../platform/files/file';
import { IInstantiationService } from '../../../platform/instantiation/instantiation';
import { ControlEditor } from '../../browser/parts/editor/controlEditor';
import { TextFileEditor } from '../../browser/parts/editor/textFileEditor';
import { EditorInput } from '../../common/editor';
import { TextFileEditorModel } from '../../services/textfile/textFileEditorModel';

export class FileEditorInput extends EditorInput {
  protected resource: string;
  protected name: string;

  constructor(
    resource: string,
    name: string,
    @IInstantiationService private instantiationService: IInstantiationService
  ) {
    super();

    this.resource = resource;
    this.name = name;
  }

  public getName(): string {
    return this.name;
  }

  public getResource(): string {
    return this.resource;
  }

  public matches(other: IEditorInput) {
    if (this === other) {
      return true;
    }

    return this.getResource() === other.getResource();
  }

  public resolve(): Promise<TextFileEditorModel> {
    return Promise.resolve().then(() => {
      let model: TextFileEditorModel = this.instantiationService.create(TextFileEditorModel, this.resource);
      let modelPromise = model.load();

      return modelPromise;
    });
  }

  public getPreferredEditorId(): string {
    if (this.resource) {
      const ext = path.extname(this.resource).slice(1);
      if (ext === Files.dlg) {
        return ControlEditor.ID;
      }
    }

    return TextFileEditor.ID;
  }
}
