import { isNullOrUndefined } from '../../base/common/types';
import { IStringStream } from '../../platform/files/files';
import { Me5ResourceBuffer } from './model/me5ResourceBuffer';
import { ResourceBuffer } from './model/resourceBuffer';
import { ResourceBufferBuilder, ResourceBufferFactory } from './model/resourceBufferBuilder';

export function createResourceBufferBuilder() {
  return new ResourceBufferBuilder();
}

export function createMe5ResourceBuffer(source: Buffer) {
  return new Me5ResourceBuffer(source);
}

export function createMe5ResourceBufferFactoryFromStream(stream: IStringStream): Promise<ResourceBufferFactory> {
  return new Promise<ResourceBufferFactory>((c, e) => {
    let done = false;
    let builder = createResourceBufferBuilder();

    stream.on('data', (chunk) => {
      builder.acceptChunk(chunk);
    });

    stream.on('error', (error) => {
      if (!done) {
        console.error(error);
        done = true;
        e(error);
      }
    });

    stream.on('end', () => {
      if (!done) {
        done = true;
        c(builder.finish(createMe5ResourceBuffer));
      }
    });
  });
}

export class ResourceModel {
  private buffer: ResourceBuffer;
  private currentBufferIndex: number;

  constructor(buffer: ResourceBuffer) {
    this.buffer = buffer;
    this.currentBufferIndex = null;
  }

  public getData(bufferIndex: number) {
    return this.buffer.get(bufferIndex);
  }

  public setDataIndex(index: number) {
    this.currentBufferIndex = index;
  }

  public getCurrentData() {
    if (isNullOrUndefined(this.currentBufferIndex)) {
      return null;
    }

    return this.buffer.get(this.currentBufferIndex);
  }

  public getBuffer(): ResourceBuffer {
    return this.buffer;
  }

  public add(buffer: Buffer): number {
    return this.buffer.add(buffer);
  }
}
