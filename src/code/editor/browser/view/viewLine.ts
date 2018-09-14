import { ViewportData } from '../../common/view/viewportData';
import { RenderLineInput, renderViewLine } from '../../common/viewLayout/viewLineRenderer';

export class ViewLine {

    constructor() {
    }

    public renderLine(lineNumber: number, viewportData: ViewportData): string {
        const lineData = viewportData.getViewLineRenderingData(lineNumber);
        console.log(lineData);

        let html = '';
        const renderLineInput = new RenderLineInput(
            lineData.content,
            4
        );

        html += '<div>';
        html += renderViewLine(renderLineInput);
        html += '</div>';

        return html;
    }
}
