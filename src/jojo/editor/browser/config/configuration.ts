import { Event } from 'jojo/base/common/event';
import { Disposable } from 'jojo/base/common/lifecycle';
import { ElementSizeObserver } from 'jojo/editor/browser/config/elementSizeObserver';
import { IConfigurationChangedEvent, InternalEditorOptions } from 'jojo/editor/common/config/editorOptions';
import { IDimension } from 'jojo/editor/common/editorCommon';

export class EditorConfiguration extends Disposable {
  public editorOptions: InternalEditorOptions;

  private observer: ElementSizeObserver;

  public readonly onDidChange = this.registerDispose(new Event<IConfigurationChangedEvent>());

  constructor(referenceDom: HTMLElement) {
    super();

    this.observer = new ElementSizeObserver(referenceDom, () => this._onReferenceDomElementSizeChanged());
    this.editorOptions = null;

    this._recomputeOptions();
  }

  private _onReferenceDomElementSizeChanged(): void {
    this._recomputeOptions();
  }

  private _computeInternalOptions(): InternalEditorOptions {
    return new InternalEditorOptions({
      layoutInfo: {
        contentLeft: 0,
        contentWidth: this.observer.getWidth(),
        contentHeight: this.observer.getHeight(),
      },
    });
  }

  private _recomputeOptions(): void {
    const oldOptions = this.editorOptions;
    const newOptions = this._computeInternalOptions();

    if (oldOptions && oldOptions.equals(newOptions)) {
      return;
    }

    this.editorOptions = newOptions;

    if (oldOptions) {
      this.onDidChange.fire(oldOptions.createChangeEvent(newOptions));
    }
  }

  public observeReferenceDomElement(dimension?: IDimension): void {
    this.observer.observe(dimension);
  }
}
