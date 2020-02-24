import { ResourceBuffer } from 'jojo/editor/common/model/resourceBuffer';

export class ResourceBufferFactory {
  constructor(private readonly buffer: Buffer, private createBufferFn: (source) => ResourceBuffer) {}

  public create() {
    return this.createBufferFn(this.buffer);
  }
}

export class ResourceBufferBuilder {
  private binaryBuffer: Buffer;

  constructor() {
    this.binaryBuffer = Buffer.alloc(0);
  }

  public acceptChunk(chunk: string): void {
    if (chunk.length === 0) {
      return;
    }

    this._acceptChunk(chunk);
  }

  private _acceptChunk(chunk: string): void {
    const buffer = Buffer.from(chunk, 'binary');
    this.binaryBuffer = Buffer.concat([this.binaryBuffer, buffer]);
  }

  public finish(createBufferFn: (source) => ResourceBuffer): ResourceBufferFactory {
    if (this.binaryBuffer.length === 0) {
      this._acceptChunk('');
    }

    return new ResourceBufferFactory(this.binaryBuffer, createBufferFn);
  }
}
