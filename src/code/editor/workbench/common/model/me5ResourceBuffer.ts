import { ResourceBuffer, BinaryBufferBase } from '../../../common/model/resourceBuffer';
import { Me5File } from '../../../common/me5File';

export class Me5ResourceBuffer extends ResourceBuffer {
    constructor(buffer: Buffer) {
        super(buffer);
    }

    protected create(buffer: Buffer) {
        const file = new Me5File(buffer);

        let bufferIndex = 0;
        const firstGroupOffset = file.getGroupOffset(0);
        this.binaryBuffers.push(
            new BinaryBufferBase(buffer.slice(0, firstGroupOffset), bufferIndex++)
        );

        const groupCount = file.getGroupCount();
        let curOffset = firstGroupOffset;
        for (let groupIndex = 0; groupIndex < groupCount; groupIndex++) {
            console.log(`groupIndex : ${groupIndex}`);
            const groupNameLength = file.getGroupNameLength(groupIndex);
            this.binaryBuffers.push(
                new BinaryBufferBase(buffer.slice(curOffset, curOffset + groupNameLength), bufferIndex++)
            );

            curOffset += groupNameLength;
            const subItemCount = file.getGroupItemCount(groupIndex);
            for (let itemIndex = 0; itemIndex < subItemCount; itemIndex++) {
                console.log(`itemIndex : ${itemIndex}`);
                const itemNameLength = file.getItemNameLength(groupIndex, itemIndex);
                this.binaryBuffers.push(
                    new BinaryBufferBase(buffer.slice(curOffset, curOffset + itemNameLength), bufferIndex++)
                );
                curOffset += itemNameLength;

                const itemSize = file.getItemSize(groupIndex, itemIndex);
                this.binaryBuffers.push(
                    new BinaryBufferBase(buffer.slice(curOffset, curOffset + itemSize), bufferIndex++)
                );
                curOffset += itemSize;
            }
        }
    }
}