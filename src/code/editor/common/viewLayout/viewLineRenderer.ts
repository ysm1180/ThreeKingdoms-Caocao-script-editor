export class RenderLineInput {
    private lineContent: string;
    private tabSize: number;

    constructor(
        lineContent: string,
        tabSize: number,
    ) {
        this.lineContent = lineContent;
        this.tabSize = tabSize;
    }

    public getLineContent(): string {
        return this.lineContent;
    }

    public getTabSize(): number {
        return this.tabSize;
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

    html += `<span>${input.getLineContent()}</span>`;

    return html;
}