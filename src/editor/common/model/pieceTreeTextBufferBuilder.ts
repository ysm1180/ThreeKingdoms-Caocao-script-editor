import { StringBuffer, createLineStartsFast } from './pieceTreeBase';

import { ITextBufferFactory } from '../models';
import { PieceTreeTextBuffer } from './pieceTreeTextBuffer';

export class PieceTreeTextBufferFactory implements ITextBufferFactory {
  constructor(private readonly chunks: StringBuffer[]) {}

  public create() {
    return new PieceTreeTextBuffer(this.chunks);
  }
}

export class PieceTreeTextBufferBuilder {
  private chunks: StringBuffer[];

  constructor() {
    this.chunks = [];
  }

  public acceptChunk(chunk: string): void {
    if (chunk.length === 0) {
      return;
    }

    this._acceptChunk(chunk);
  }

  private _acceptChunk(chunk: string): void {
    const lineStarts = createLineStartsFast(chunk);

    this.chunks.push(new StringBuffer(chunk, lineStarts));
  }

  public finish(): PieceTreeTextBufferFactory {
    if (this.chunks.length === 0) {
      this._acceptChunk('');
    }

    return new PieceTreeTextBufferFactory(this.chunks);
  }
}
