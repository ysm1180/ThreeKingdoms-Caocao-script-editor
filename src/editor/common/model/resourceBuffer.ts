export class BinaryBufferBase {
  public readonly buffer: Buffer;

  constructor(buffer: Buffer) {
    this.buffer = buffer;
  }
}

export abstract class ResourceBuffer {
  protected binaryBuffers: BinaryBufferBase[];

  constructor(buffer: Buffer) {
    this.binaryBuffers = [];

    this.create(buffer);
  }

  public get(bufferIndex: number): Buffer {
    if (this.binaryBuffers.length <= bufferIndex) {
      return null;
    }

    return this.binaryBuffers[bufferIndex].buffer;
  }

  public add(buffer: Buffer): number {
    this.binaryBuffers.push(new BinaryBufferBase(buffer));
    return this.binaryBuffers.length - 1;
  }

  protected abstract create(buffer: Buffer): void;
}
