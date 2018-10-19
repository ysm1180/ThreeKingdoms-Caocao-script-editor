import { CharCode } from '../../../base/common/charCode';

export class RenderLineInput {
    public readonly lineContent: string;
    public readonly tabSize: number;

    constructor(
        lineContent: string,
        tabSize: number,
    ) {
        this.lineContent = lineContent;
        this.tabSize = tabSize;
    }

    public equels(other: RenderLineInput): boolean {
        return (
            this.tabSize === other.tabSize &&
            this.lineContent === this.lineContent
        );
    }
}

export function renderViewLine(input: RenderLineInput): string {
    let html = '';
    let content = '';

    const lineContent = input.lineContent;
    const length = input.lineContent.length;
    for (let charIndex = 0; charIndex < length; charIndex++) {
        const charCode = lineContent.charCodeAt(charIndex);
        if (charCode === CharCode.Tab) {
            for (let tabSize = 0; tabSize < input.tabSize; tabSize++) {
                content += '&nbsp;';
            }
        } else if (charCode === CharCode.Space) {
            content += '&nbsp;';
        } else {
            content += String.fromCharCode(charCode);
        }
    }

    html += `<span>${content}</span>`;

    return html;
}