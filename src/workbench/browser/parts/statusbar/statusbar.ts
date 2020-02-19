import { IDisposable, combinedDisposable } from '../../../../base/common/lifecycle';
import { ContextKeyExpr } from '../../../../platform/contexts/contextKey';
import { ClassDescriptor, ClassDescriptor1 } from '../../../../platform/instantiation/descriptors';
import { IConstructorSignature0 } from '../../../../platform/instantiation/instantiation';
import { IStatusbarEntry, StatusbarItemAlignment } from '../../../../platform/statusbar/statusbar';

export interface IStatusbarItem {
  when?: ContextKeyExpr;
  alignment?: StatusbarItemAlignment;
  priority?: number;
  render(element: HTMLElement);
}

export class StatusbarItemDescriptor {
  public readonly ctor: ClassDescriptor1<IStatusbarEntry, IStatusbarItem>;
  public readonly id: string;
  public readonly alignment: StatusbarItemAlignment;
  public readonly when: ContextKeyExpr;
  public readonly priority: number;

  constructor(
    ctor: IConstructorSignature0<IStatusbarItem>,
    id: string,
    alignment?: StatusbarItemAlignment,
    when?: ContextKeyExpr,
    priority?: number
  ) {
    this.ctor = new ClassDescriptor(ctor);
    this.id = id;
    this.alignment = alignment;
    this.when = when;
    this.priority = priority;
  }
}

export const StatusbarRegistry = new (class {
  _items: StatusbarItemDescriptor[];

  constructor() {
    this._items = [];
  }

  public registerStatusbarItem(item: StatusbarItemDescriptor) {
    this._items.push(item);
  }

  public getAllStatusbarItem(): StatusbarItemDescriptor[] {
    return this._items.slice(0);
  }
})();

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
