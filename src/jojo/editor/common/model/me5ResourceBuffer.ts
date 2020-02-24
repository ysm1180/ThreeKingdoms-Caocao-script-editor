import { Me5File } from 'jojo/editor/common/me5File';
import { ResourceBuffer } from 'jojo/editor/common/model/resourceBuffer';

export class Me5ResourceBuffer extends ResourceBuffer {
  constructor(buffer: Buffer) {
    super(buffer);
  }

  protected create(buffer: Buffer) {
    const file = new Me5File(buffer);

    this.add(buffer);

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
