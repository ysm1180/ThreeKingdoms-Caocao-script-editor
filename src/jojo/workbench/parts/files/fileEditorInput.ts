import * as path from 'path';

import { IEditorInput } from 'jojo/platform/editor/common/editor';
import { Files } from 'jojo/platform/files/common/file';
import { IInstantiationService } from 'jojo/platform/instantiation/common/instantiation';
import { ControlEditor } from 'jojo/workbench/browser/parts/editor/controlEditor';
import { TextFileEditor } from 'jojo/workbench/browser/parts/editor/textFileEditor';
import { EditorInput } from 'jojo/workbench/common/editor';
import { TextFileEditorModel } from 'jojo/workbench/services/textfile/textFileEditorModel';

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
