import { EditorConfiguration } from 'code/editor/browser/config/configuration';
import { Scroll } from 'code/base/common/scroll';
import { LinesLayout } from './linesLayout';
import { Disposable } from 'code/base/common/lifecycle';

export class ViewLayout extends Disposable {
    private configuration: EditorConfiguration;
    private linesLayout: LinesLayout;

    public readonly scroll: Scroll;
    
    constructor(configuration: EditorConfiguration, lineCount: number, lineHeight: number) {
        super();

        this.configuration = configuration;
        this.linesLayout = new LinesLayout(lineCount, lineHeight);

        this.scroll = new Scroll();

        this.scroll.setScrollDimensions({
            width: configuration.editorOptions.layoutInfo.contentWidth,
            height: configuration.editorOptions.layoutInfo.contentHeight,
        });

        this._updateHeight();
    }

    private _getTotalHeight(): number {
        const scrollDimensions = this.scroll.getScrollDimensions();

		let result = this.linesLayout.getLinesTotalHeight();

		return Math.max(scrollDimensions.height, result);
    }

    private _updateHeight(): void {
        this.scroll.setScrollDimensions({
            scrollHeight: this._getTotalHeight(),
        });
    }

    public onMaxLineWidthChanged(maxLineWidth: number): void {
		this.scroll.setScrollDimensions({
			scrollWidth: maxLineWidth
		});
	}

    public onConfigurationChanged(e): void {
        this.scroll.setScrollDimensions({
            width: this.configuration.editorOptions.layoutInfo.contentWidth,
            height: this.configuration.editorOptions.layoutInfo.contentHeight,
        });

        this._updateHeight();
    }

}