/**
 * @internal
 */
export interface ITextBufferBuilder {
	acceptChunk(chunk: string): void;
	finish(): ITextBufferFactory;
}

/**
 * @internal
 */
export interface ITextBufferFactory {
	create(): ITextBuffer;
}

/**
 * @internal
 */
export interface ITextBuffer {
	getLength(): number;
	getLineCount(): number;
	getLinesContent(): string[];
	getLineContent(lineNumber: number): string;
}