import { Event } from 'jojo/base/common/event';
import { ResourceBufferFactory } from 'jojo/editor/common/model/resourceBufferBuilder';
import { ResourceModel } from 'jojo/editor/common/resourceModel';
import { StateChange } from 'jojo/platform/files/common/files';
import { IBinaryDataService, IBinaryFileEditorModel, IBinaryFileService, IResourceStat } from 'jojo/workbench/services/binaryfile/binaryFiles';
import { IRawResourceContent } from 'jojo/workbench/services/textfile/textfiles';

export class BinaryFileEditorModel implements IBinaryFileEditorModel {
  private _resourceModel: ResourceModel;
  private _resourceStat: IResourceStat;

  private _isSaving: boolean;

  private savingPromise: Promise<void>;

  public onDidStateChanged = new Event<StateChange>();

  constructor(
    private resource: string,
    @IBinaryFileService private binaryFileService: IBinaryFileService,
    @IBinaryDataService private binaryDataService: IBinaryDataService
  ) {
    this._resourceModel = null;
    this._isSaving = false;
    this.savingPromise = null;
  }

  public get resourceModel(): ResourceModel {
    return this._resourceModel;
  }

  public get resourceStat(): IResourceStat {
    return this._resourceStat;
  }

  public getResource(): string {
    return this.resource;
  }

  public load(): Promise<BinaryFileEditorModel> {
    return this._loadFromFile();
  }

  private _loadFromFile(): Promise<BinaryFileEditorModel> {
    return this.binaryFileService.resolveRawContent(this.resource).then(
      (content) => this._loadWithContent(content),
      () => this.onHandleFailed()
    );
  }

  private _loadWithContent(content: IRawResourceContent): Promise<BinaryFileEditorModel> {
    return this._createResourceEditorModel(content.value);
  }

  private _createResourceEditorModel(value: ResourceBufferFactory): Promise<BinaryFileEditorModel> {
    this._createResourceModel(value);
    return this._createResourceStat().then((result) => {
      this._resourceStat = result;
      return this;
    });
  }

  private _createResourceModel(value: ResourceBufferFactory): void {
    this._resourceModel = new ResourceModel(value.create());
  }

  private _createResourceStat(): Promise<IResourceStat> {
    return this.binaryDataService.resolveFile(this.resource);
  }

  public getCurrentData() {
    return this._resourceModel ? this._resourceModel.getCurrentData() : null;
  }

  public setDataIndex(index: number): void {
    if (this._resourceModel) {
      this._resourceModel.setDataIndex(index);
    }
  }

  private onHandleFailed() {
    console.error('Resource File Load Failed');
    return Promise.reject(null);
  }

  public save() {
    if (this.savingPromise) {
      return this.savingPromise;
    }

    this.savingPromise = new Promise((c, e) => {
      this._isSaving = true;
      this.onDidStateChanged.fire(StateChange.SAVING);

      this.binaryFileService.updateContents(this.resource, this._resourceStat).then(
        () => {
          this.finishSave();
          this.onDidStateChanged.fire(StateChange.SAVED);

          c();
        },
        () => {
          console.error('Fail to save');

          this.finishSave();
          this.onDidStateChanged.fire(StateChange.SAVED);

          e();
        }
      );
    });

    return this.savingPromise;
  }

  private finishSave() {
    this._isSaving = false;
    this.savingPromise = null;
  }

  public isSaving(): boolean {
    return this._isSaving;
  }

  public dispose(): void {}
}
