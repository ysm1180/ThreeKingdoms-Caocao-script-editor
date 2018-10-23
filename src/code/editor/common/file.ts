import * as Convert from '../../base/common/convert';
import { BinaryFile } from '../../platform/files/file';
import { Me5Stat, FilterFuntion } from '../workbench/parts/files/me5Data';
import { ImageResource } from '../workbench/common/imageResource';

export interface ISaveMe5Data {
    root: Me5Stat;
}

export class Me5File extends BinaryFile {
    private static readonly ALL_ITEM_COUNT_OFFSET = 1;
    private static readonly GROUP_COUNT_OFFSET = 5;

    private static readonly ITEM_HEADER_SIZE = 12;
    private static readonly GROUP_HEADER_SIZE = 12;

    private static readonly GROUP_INFO_START_OFFSET = 9;
    private itemInfoStartOffset: number;

    constructor(path: string) {
        super(path);
    }

    public open(): Promise<BinaryFile> {
        return super.open().then(() => {
            this.itemInfoStartOffset = this.getGroupCount() * Me5File.GROUP_HEADER_SIZE + Me5File.GROUP_INFO_START_OFFSET;
            return this;
        }, (e: NodeJS.ErrnoException) => {
            return null;
        });
    }

    public isEncoding(): boolean {
        return this.readByte(0) === 1 ? true : false;
    }

    public getAllItemCount(): number {
        return this.readNumber(Me5File.ALL_ITEM_COUNT_OFFSET);
    }

    public getGroupCount(): number {
        return this.readNumber(Me5File.GROUP_COUNT_OFFSET);
    }

    private _getFirstItemIndexInGroup(groupIndex: number) {
        return this.readNumber(Me5File.GROUP_INFO_START_OFFSET + 4 + groupIndex * Me5File.GROUP_HEADER_SIZE);
    }

    private _getLastItemIndexInGroup(groupIndex: number) {
        return this.readNumber(Me5File.GROUP_INFO_START_OFFSET + 8 + groupIndex * Me5File.GROUP_HEADER_SIZE);
    }

    public getGroupItemCount(groupIndex: number) {
        return this._getLastItemIndexInGroup(groupIndex) - this._getFirstItemIndexInGroup(groupIndex) + 1;
    }

    private _getOffsetByItemIndex(itemIndex: number): number {
        return this.readNumber(this.itemInfoStartOffset + itemIndex * Me5File.ITEM_HEADER_SIZE);
    }

    public getItemOffset(groupIndex: number, subItemIndex: number): number {
        const firstItemIndex = this._getFirstItemIndexInGroup(groupIndex);
        return this._getOffsetByItemIndex(firstItemIndex + subItemIndex);
    }

    public getGroupNameLength(groupIndex: number): number {
        return this.readNumber(Me5File.GROUP_INFO_START_OFFSET + groupIndex * Me5File.GROUP_HEADER_SIZE);
    }

    public getItemNameLength(groupIndex: number, subItemIndex: number) {
        const firstItemIndex = this._getFirstItemIndexInGroup(groupIndex);
        return this.readNumber(this.itemInfoStartOffset + 4 + (firstItemIndex + subItemIndex) * Me5File.ITEM_HEADER_SIZE);
    }

    public getGroupName(groupIndex: number): string {
        let offset = this.getItemOffset(groupIndex, 0);
        const length = this.getGroupNameLength(groupIndex);
        offset -= length;
        return this.readString(offset, length);
    }

    public getItemName(groupIndex: number, subItemIndex: number): string {
        const itemOffset = this.getItemOffset(groupIndex, subItemIndex);
        const itemNameLength = this.getItemNameLength(groupIndex, subItemIndex);
        return this.readString(itemOffset, itemNameLength);
    }

    public getItemSize(groupIndex: number, subItemIndex: number): number {
        const firstItemIndex = this._getFirstItemIndexInGroup(groupIndex);
        return this.readNumber(this.itemInfoStartOffset + 8 + (firstItemIndex + subItemIndex) * Me5File.ITEM_HEADER_SIZE);
    }

    public getItemData(groupIndex: number, subItemIndex: number): Uint8Array {
        const offset = this.getItemOffset(groupIndex, subItemIndex);
        const itemSize = this.getItemSize(groupIndex, subItemIndex);
        const itemNameLength = this.getItemNameLength(groupIndex, subItemIndex);
        return this.readBytes(offset + itemNameLength, itemSize);
    }

    public save(data: ISaveMe5Data, groupFilter?: FilterFuntion<Me5Stat>): Promise<void> {
        return Promise.resolve().then(() => {
            const groups = data.root.getChildren(groupFilter);

            const itemLengths = groups.map((group) => group.getChildren().length);
            this._setAllItemCount(itemLengths.reduce((pre, cur) => pre + cur, 0));
            this._setGroupCount(groups.length);

            this.itemInfoStartOffset = groups.length * Me5File.GROUP_HEADER_SIZE + Me5File.GROUP_INFO_START_OFFSET;

            let baseItemIndex = 0;
            for (const group of groups) {
                this._setGroupInfo(group, baseItemIndex, groupFilter);

                const items = group.getChildren();
                for (const item of items) {
                    this._setItemInfo(item, baseItemIndex);
                }
                baseItemIndex += items.length;
            }

            const setGroupPromises = [];

            let offset = this.itemInfoStartOffset + baseItemIndex * Me5File.ITEM_HEADER_SIZE;
            baseItemIndex = 0;

            for (const group of groups) {
                setGroupPromises.push(() => new Promise((c, e) => {
                    const setItemPromises = [];

                    offset += this._setGroup(offset, group);

                    const items = group.getChildren();
                    for (const item of items) {
                        setItemPromises.push((offset) => {
                            return this._setItem(offset, item, baseItemIndex).then((length) => {
                                return offset + length;
                            });
                        });
                    }

                    setItemPromises.reduce((cur, next) => {
                        return cur.then((offset) => {
                            return next(offset);
                        }).then((changedOffset) => {
                            offset = changedOffset;
                            return offset;
                        });
                    }, Promise.resolve(offset)).then(() => {
                        baseItemIndex += items.length;
                        c();
                    });
                }));
            }

            return setGroupPromises.reduce((cur, next) => {
                return cur.then(next);
            }, Promise.resolve());
        });
    }

    private _setAllItemCount(count: number) {
        this.writeInt(Me5File.ALL_ITEM_COUNT_OFFSET, count);
    }

    private _setGroupCount(count: number) {
        this.writeInt(Me5File.GROUP_COUNT_OFFSET, count);
    }

    private _setGroupInfo(group: Me5Stat, baseItemIndex: number, filter?: FilterFuntion<Me5Stat>) {
        const offset = Me5File.GROUP_INFO_START_OFFSET + group.getIndex(filter) * Me5File.GROUP_HEADER_SIZE;
        this.writeInt(offset + 4, baseItemIndex); // Item Begin Index
        this.writeInt(offset + 8, baseItemIndex + group.getChildren().length - 1); // Item End Index
        this.writeInt(offset, Convert.getByteLength(group.name));
    }

    private _setItemInfo(item: Me5Stat, baseItemIndex: number, filter?: FilterFuntion<Me5Stat>) {
        const offset = this.itemInfoStartOffset + (baseItemIndex + item.getIndex(filter)) * Me5File.ITEM_HEADER_SIZE;
        this.writeInt(offset, 0); // item offset
        this.writeInt(offset + 4, Convert.getByteLength(item.name));
        this.writeInt(offset + 8, 0); // item size
    }

    private _setGroup(offset: number, group: Me5Stat): number {
        const name = group.name;
        const length = Convert.getByteLength(name);

        this.write(offset, length, Convert.strToBytes(name));

        return length;
    }

    private _setItem(offset: number, item: Me5Stat, baseItemIndex: number, filter?: FilterFuntion<Me5Stat>): Promise<number> {
        const name = item.name;
        const length = Convert.getByteLength(name);

        const startItemOffset = this.itemInfoStartOffset + (baseItemIndex + item.getIndex(filter)) * Me5File.ITEM_HEADER_SIZE;
        this.writeInt(startItemOffset, offset);
        this.write(offset, length, Convert.strToBytes(name));

        return ImageResource.convertToJpeg(Buffer.from(item.data.buffer)).then((data) => {
            this.writeInt(startItemOffset + 8, data.length);
            this.write(offset + length, data.length, data);

            return Promise.resolve(length + data.length);
        });
    }
}