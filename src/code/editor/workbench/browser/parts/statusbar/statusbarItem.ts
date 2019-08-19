import { combinedDisposable, IDisposable } from '../../../../../base/common/lifecycle';
import { ContextKeyExpr } from '../../../../../platform/contexts/contextKey';
import {
    IStatusbarEntry, IStatusbarItem, StatusbarItemAlignment
} from '../../../../../platform/statusbar/statusbar';

export class FileStatusItem implements IStatusbarItem {
    private label: HTMLElement;

    public static ID = 'STATUS_FILE_ITEM';

    constructor(private entry: IStatusbarEntry) {}

    public get alignment(): StatusbarItemAlignment {
        return StatusbarItemAlignment.LEFT;
    }

    public get when(): ContextKeyExpr {
        return this.entry.when;
    }

    public render(element: HTMLElement): IDisposable {
        const dispose = [];

        this.label = document.createElement('span');
        element.appendChild(this.label);

        return combinedDisposable(dispose);
    }
}
