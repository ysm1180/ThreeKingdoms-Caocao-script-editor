export class BinaryBufferBase {
    public readonly buffer: Buffer;
    public readonly bufferIndex: number;

    constructor(buffer: Buffer, bufferIndex: number) {
        this.buffer = buffer;
        this.bufferIndex = bufferIndex;
    }
}

export abstract class ResourceBuffer {
    protected binaryBuffers: BinaryBufferBase[];

    constructor(buffer: Buffer) {
        this.binaryBuffers = [];

        this.create(buffer);
    }

    public getBuffer(bufferIndex: number): Buffer {
        for (const binaryBuffer of this.binaryBuffers) {
            if (binaryBuffer.bufferIndex === bufferIndex) {
                return binaryBuffer.buffer;
            }
        }

        return null;
    }

    protected abstract create(buffer: Buffer): void;
}