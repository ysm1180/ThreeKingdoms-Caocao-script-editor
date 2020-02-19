import { IDisposable, combinedDisposable } from '../../../../base/common/lifecycle';
import { ContextKeyExpr } from '../../../../platform/contexts/contextKey';
import { IEditorInput } from '../../../../platform/editor/editor';
import { IStatusbarEntry, IStatusbarItem, StatusbarItemAlignment } from '../../../../platform/statusbar/statusbar';
import { ResourceEditorInput } from '../../../common/editor/resourceEditorInput';
import { ImageResource } from '../../../common/imageResource';
import { IResourceFileService } from '../../../services/binaryfile/binaryFiles';
import { BinaryFileService } from '../../../services/binaryfile/binaryFileService';
import { EditorPart, IEditorGroupService } from '../editor/editorPart';

export class ImageViewStatusItem implements IStatusbarItem {
  private imageSize: HTMLElement;

  public static ID = 'STATUS_IMAGE_VIEW';

  constructor(
    private entry: IStatusbarEntry,
    @IEditorGroupService private editorService: EditorPart,
    @IResourceFileService private resourceFileService: BinaryFileService
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

    const dataModel = this.resourceFileService.models.get(input.getResource());
    const image = new ImageResource();
    const dataArray = new Uint8Array(dataModel.getCurrentData());
    if (image.build(dataArray)) {
      this.imageSize.textContent = `이미지 사이즈 : ${image.width} X ${image.height}`;
    }
  }
}
