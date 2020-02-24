import { IDisposable, combinedDisposable } from 'jojo/base/common/lifecycle';
import { ContextKeyExpr } from 'jojo/platform/contexts/common/contextKey';
import { IEditorInput } from 'jojo/platform/editor/common/editor';
import { IStatusbarEntry, StatusbarItemAlignment } from 'jojo/platform/statusbar/common/statusbar';
import { IStatusbarItem } from 'jojo/workbench/browser/parts/statusbar/statusbar';
import { ResourceEditorInput } from 'jojo/workbench/common/editor/resourceEditorInput';
import { ImageFile } from 'jojo/workbench/common/imageFile';
import { IBinaryFileService } from 'jojo/workbench/services/binaryfile/binaryFiles';
import { BinaryFileService } from 'jojo/workbench/services/binaryfile/binaryFileService';
import { IEditorGroupService } from 'jojo/workbench/services/group/editorGroupService';

export class ImageViewStatusItem implements IStatusbarItem {
  private imageSize: HTMLElement;

  public static ID = 'STATUS_IMAGE_VIEW';

  constructor(
    private entry: IStatusbarEntry,
    @IEditorGroupService private editorService: IEditorGroupService,
    @IBinaryFileService private binaryFileService: BinaryFileService
  ) {}

  public get alignment(): StatusbarItemAlignment {
    return StatusbarItemAlignment.LEFT;
  }

  public get when(): ContextKeyExpr {
    return this.entry.when;
  }

  public render(element: HTMLElement): IDisposable {
    const dispose = [];

    this.imageSize = document.createElement('span');
    element.appendChild(this.imageSize);

    dispose.push(this.editorService.onEditorInputChanged.add((e) => this._onInputChanged(e)));

    return combinedDisposable(dispose);
  }

  public _onInputChanged(input: IEditorInput) {
    if (!(input instanceof ResourceEditorInput)) {
      this.imageSize.textContent = '';
      return;
    }

    const dataModel = this.binaryFileService.models.get(input.getResource());
    const image = new ImageFile();
    const dataArray = new Uint8Array(dataModel.getCurrentData());
    if (image.build(dataArray)) {
      this.imageSize.textContent = `이미지 사이즈 : ${image.width} X ${image.height}`;
    }
  }
}
