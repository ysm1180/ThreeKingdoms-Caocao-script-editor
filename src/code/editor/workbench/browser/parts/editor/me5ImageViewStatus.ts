import { IStatusbarItem, IStatusbarEntry, StatusbarItemAlignment } from 'code/platform/statusbar/statusbar';
import { ContextKeyExpr } from 'code/platform/contexts/contextKey';
import { IEditorService, EditorPart } from 'code/editor/workbench/browser/parts/editor/editorPart';
import { IEditorEvent } from 'code/platform/editor/editor';
import { Me5Item } from '../../../parts/files/me5Data';
import { combinedDisposable } from '../../../../../base/common/lifecycle';

export class ImageViewStatus implements IStatusbarItem {
    private imageSize: HTMLElement;
    private imageSizeText: string;

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

    public render(element: HTMLElement) {
        const dispose = [];

        this.imageSize = document.createElement('span');
        element.appendChild(this.imageSize);

        dispose.push(this.editorService.onEditorInputChanged.add((e) => this.onEditorInputChanged(e)));

        return combinedDisposable(dispose);
    }

    public onEditorInputChanged(e: IEditorEvent) {
        const input = e.editor as Me5Item;

        input.resolve().then(({ image }) => {
            if (image) {
                this.imageSize.textContent = `이미지 사이즈 : ${image.width} X ${image.height}`;
            }
        });
    }
}