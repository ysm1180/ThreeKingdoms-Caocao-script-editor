import { IStringStream } from '../../platform/files/files';
import { PieceTreeTextBufferBuilder } from './model/pieceTreeTextBuffer/pieceTreeTextBufferBuilder';
import * as models from './models';

export function createTextBufferBuilder() {
  return new PieceTreeTextBufferBuilder();
}

export function createTextBufferFactory(text: string): models.ITextBufferFactory {
  const builder = createTextBufferBuilder();
  builder.acceptChunk(text);
  return builder.finish();
}

export function createTextBuffer(value: string | models.ITextBufferFactory) {
  const factory = typeof value === 'string' ? createTextBufferFactory(value) : value;
  return factory.create();
}

export function createTextBufferFactoryFromStream(
  stream: IStringStream,
  filter?: (chunk: string) => string
): Promise<models.ITextBufferFactory> {
  return new Promise<models.ITextBufferFactory>((c, e) => {
    let done = false;
    let builder = createTextBufferBuilder();

    stream.on('data', (chunk) => {
      if (filter) {
        chunk = filter(chunk);
      }

      builder.acceptChunk(chunk);
    });

    stream.on('error', (error) => {
      if (!done) {
        done = true;
        e(error);
      }
    });

    stream.on('end', () => {
      if (!done) {
        done = true;
        c(builder.finish());
      }
    });
  });
}

export class TextModel {
  private buffer: models.ITextBuffer;

  constructor(source: string | models.ITextBufferFactory) {
    this.buffer = createTextBuffer(source);
  }

  public getLineCount(): number {
    return this.buffer.getLineCount();
  }

  public getLinesContent(): string[] {
    return this.buffer.getLinesContent();
  }

  public getLineContent(lineNumber: number): string {
    return this.buffer.getLineContent(lineNumber);
  }
}
