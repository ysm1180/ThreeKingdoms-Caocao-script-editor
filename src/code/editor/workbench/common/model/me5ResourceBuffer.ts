import { ResourceBuffer } from '../../../common/model/resourceBuffer';
import { Me5File } from '../../../common/me5File';

export class Me5ResourceBuffer extends ResourceBuffer {
    constructor(buffer: Buffer) {
        super(buffer);
    }

    protected create(buffer: Buffer) {
        const file = new Me5File(buffer);

        const groupCount = file.getGroupCount();
        let curOffset = file.getGroupOffset(0);
        for (let groupIndex = 0; groupIndex < groupCount; groupIndex++) {
            const groupNameLength = file.getGroupNameLength(groupIndex);
            curOffset += groupNameLength;

            const subItemCount = file.getGroupItemCount(groupIndex);
            for (let itemIndex = 0; itemIndex < subItemCount; itemIndex++) {
                const itemNameLength = file.getItemNameLength(groupIndex, itemIndex);
                curOffset += itemNameLength;

                const itemSize = file.getItemSize(groupIndex, itemIndex);
                this.add(buffer.slice(curOffset, curOffset + itemSize));
                curOffset += itemSize;
            }
        }
    }
}