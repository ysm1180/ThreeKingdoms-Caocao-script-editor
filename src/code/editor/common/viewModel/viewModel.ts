import { TextModel } from '../textModel';
import { LinesCollection } from './linesCollection';
import { ViewLayout } from '../viewLayout/viewLayout';
import { EditorConfiguration } from '../../browser/config/configuration';
import { IConfigurationChangedEvent } from '../config/editorOptions';
import { Disposable, IDisposable } from '../../../base/common/lifecycle';

export class ViewLineData {
    public readonly content: string;

    constructor(
        content: string,
    ) {
        this.content = content;
    }
}

export class ViewLineRenderingData {
    public readonly content: string;
    public readonly tabSize: number;
    constructor(
        content: string,
        tabSize: number,
    ) {
        this.content = content;
        this.tabSize = tabSize;
    }
}

export class ViewModel extends Disposable {
    private model: TextModel;
    private lines: LinesCollection;
    private viewLayout: ViewLayout;
    private configuration: EditorConfiguration;

    private listeners: ((e: IConfigurationChangedEvent) => void)[];

    constructor(
        configuration: EditorConfiguration,
        model: TextModel,
    ) {
        super();

        this.model = model;
        this.configuration = configuration;
        
        this.lines = new LinesCollection(this.model);

        const lineHeight = 19;
        this.viewLayout = new ViewLayout(this.configuration, this.getLineCount(), lineHeight);

        this.listeners = [];

        this.registerDispose(this.configuration.onDidChange.add((e) => {
            this._onConfigurationChanged(e);
            this.runConfigurationChangedEvents(e);
        }));
    }

    public getViewLayout(): ViewLayout {
        return this.viewLayout;
    }

    public getViewLineRenderingData(lineNumber: number): ViewLineRenderingData {
        const lineData = this.lines.getViewLineData(lineNumber);
        const tabSize = 4;

        return new ViewLineRenderingData(
            lineData.content,
            tabSize
        );
    }

    public getLineCount(): number {
        return this.lines.getViewLineCount();
    }

    private _onConfigurationChanged(e: IConfigurationChangedEvent): void {
        this.viewLayout.onConfigurationChanged(e);
    }

    public addEventListner(listener: (e: any) => void): IDisposable {
        this.listeners.push(listener);

        return {
			dispose: () => {
				let listeners = this.listeners;
				for (let i = 0, len = listeners.length; i < len; i++) {
					if (listeners[i] === listener) {
						listeners.splice(i, 1);
						break;
					}
				}
			}
		};
    }

    public runConfigurationChangedEvents(e: IConfigurationChangedEvent): void {
        const listeners = this.listeners.slice(0);
		for (let i = 0, len = listeners.length; i < len; i++) {
			listeners[i](e);
		}
    }

    public dispose(): void {
        super.dispose();
        this.viewLayout.dispose();
    }
}