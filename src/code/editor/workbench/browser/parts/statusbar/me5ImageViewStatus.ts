import { IStatusbarItem, IStatusbarEntry, StatusbarItemAlignment } from '../../../../../platform/statusbar/statusbar';
import { EditorPart, IEditorService } from '../editor/editorPart';
import { ContextKeyExpr } from '../../../../../platform/contexts/contextKey';
import { IDisposable, combinedDisposable } from '../../../../../base/common/lifecycle';
import { IEditorEvent } from '../../../../../platform/editor/editor';

export class ImageViewStatus implements IStatusbarItem {
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

        dispose.push(this.editorService.onEditorInputChanged.add((e) => this.onEditorInputChanged(e)));

        return combinedDisposable(dispose);
    }

    public onEditorInputChanged(e: IEditorEvent) {
        // const input = e.editor as Me5Item;

        // input.resolve().then(({ image }) => {
        //     if (image) {
        //         this.imageSize.textContent = `이미지 사이즈 : ${image.width} X ${image.height}`;
        //     }
        // });
    }
}