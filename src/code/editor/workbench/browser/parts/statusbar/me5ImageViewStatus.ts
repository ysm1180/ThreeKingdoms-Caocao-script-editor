import { IStatusbarItem, IStatusbarEntry, StatusbarItemAlignment } from '../../../../../platform/statusbar/statusbar';
import { EditorPart, IEditorService } from '../editor/editorPart';
import { ContextKeyExpr } from '../../../../../platform/contexts/contextKey';
import { IDisposable, combinedDisposable } from '../../../../../base/common/lifecycle';
import { IEditorInput } from '../../../../../platform/editor/editor';
import { ResourceEditorInput } from '../../../common/editor/resourceEditorInput';
import { decodeFromBase64 } from '../../../../../base/common/encode';
import { ImageResource } from '../../../common/imageResource';

export class ImageViewStatusItem implements IStatusbarItem {
    private imageSize: HTMLElement;

    public static ID = 'STATUS_IMAGE_VIEW';

    constructor(
        private entry: IStatusbarEntry,
        @IEditorService private editorService: EditorPart,
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

        dispose.push(this.editorService.onDidEditorSetInput.add((e) => this._onInputChanged(e)));

        return combinedDisposable(dispose);
    }

    public _onInputChanged(input: IEditorInput) {
        if (!(input instanceof ResourceEditorInput)) {
            this.imageSize.textContent = '';
            return;
        }

        // const resourceInput = <ResourceEditorInput>input;
        // resourceInput.resolve().then(dataModel => {
        //     if (dataModel) {
        //         const dataArray = decodeFromBase64(dataModel.getResource());
        //         const image = new ImageResource();
        //         if (image.build(dataArray)) {
        //             this.imageSize.textContent = `이미지 사이즈 : ${image.width} X ${image.height}`;
        //         } else {
        //             this.imageSize.textContent = '';
        //         }
        //     }
        // });
    }
}