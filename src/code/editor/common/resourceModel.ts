import { ResourceBufferBuilder, ResourceBufferFactory } from './model/resourceBufferBuilder';
import { IStringStream } from '../../platform/files/files';
import { ResourceBuffer } from './model/resourceBuffer';
import { Me5ResourceBuffer } from '../workbench/common/model/me5ResourceBuffer';

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
			console.info('read data');
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
				console.log(builder);
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
		this.currentBufferIndex = 0;
	}
	
	public getBuffer(bufferIndex: number) {
		return this.buffer.getBuffer(bufferIndex);
	}

	public setCurrentBufferIndex(index: number) { 
		this.currentBufferIndex = index;
	}

	public getCurrentBuffer() {
		return this.buffer.getBuffer(this.currentBufferIndex);
	}

}