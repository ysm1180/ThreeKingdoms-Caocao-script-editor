import { ElementSizeObserver } from './elementSizeObserver';
import { Disposable } from '../../../base/common/lifecycle';
import { InternalEditorOptions, IConfigurationChangedEvent } from '../../common/config/editorOptions';
import { Event } from '../../../base/common/event';
import { IDimension } from '../../common/editorCommon';

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