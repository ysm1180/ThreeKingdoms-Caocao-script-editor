import { IStatusbarItem, IStatusbarEntry, StatusbarItemAlignment } from '../../../../../platform/statusbar/statusbar';
import { EditorPart, IEditorGroupService } from '../editor/editorPart';
import { ContextKeyExpr } from '../../../../../platform/contexts/contextKey';
import { IDisposable, combinedDisposable } from '../../../../../base/common/lifecycle';
import { IEditorInput } from '../../../../../platform/editor/editor';
import { ResourceEditorInput } from '../../../common/editor/resourceEditorInput';
import { decodeFromBase64 } from '../../../../../base/common/encode';
import { ImageResource } from '../../../common/imageResource';
import { IResourceFileSerivce } from '../../../services/resourceFile/resourcefiles';
import { ResourceFileService } from '../../../services/resourceFile/resourceFileService';

export class ImageViewStatusItem implements IStatusbarItem {
    private imageSize: HTMLElement;

    public static ID = 'STATUS_IMAGE_VIEW';

    constructor(
        private entry: IStatusbarEntry,
        @IEditorGroupService private editorService: EditorPart,
        @IResourceFileSerivce private resourceFileService: ResourceFileService,
    ) {
    }

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

        const dataModel = this.resourceFileService.models.get(input.getId());
        const image = new ImageResource();
        const dataArray = new Uint8Array(dataModel.getCurrentData());
        if (image.build(dataArray)) {
            this.imageSize.textContent = `이미지 사이즈 : ${image.width} X ${image.height}`;
        }
    }
}