export class LinesLayout {
    private lineCount: number;
    private lineHeight: number;

    constructor(lineCount: number, lineHeight: number) {
        this.lineCount = lineCount;
        this.lineHeight = lineHeight;
    }

    public setLineHeight(lineHeight: number): void {
        this.lineHeight = lineHeight;
    }

    public getLinesTotalHeight(): number {
        const linesHeight = this.lineHeight * this.lineCount;
        return linesHeight;
    }
}
