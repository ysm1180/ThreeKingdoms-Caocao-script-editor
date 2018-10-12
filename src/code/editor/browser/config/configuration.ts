import { ElementSizeObserver } from './elementSizeObserver';
import { InternalEditorOptions, IConfigurationChangedEvent } from 'code/editor/common/config/editorOptions';
import { Event } from 'code/base/common/event';
import { Disposable } from 'code/base/common/lifecycle';
import { IDimension } from 'code/editor/common/editorCommon';

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
            }
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