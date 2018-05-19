import * as fs from 'fs';

export class BinaryFile {
    public data: Buffer;
    private path: string;

    constructor(path: string) {
        this.path = path;
    }

    public open(): Promise<void | Buffer> {
        return new Promise<Buffer>((c, e) => {
            fs.readFile(this.path, {}, (err, data) => {
                if (err) {
                    e(err);
                    return;
                }

                this.data = data;

                c(data);
            });
        });
    }

    public readNumber(offset: number): number {
        const bytes: ArrayBuffer = this.data.buffer.slice(offset, offset + 4);
        return new Uint32Array(bytes)[0];
    }

    public readByte(offset: number): number {
        return this.data.buffer[offset];
    }

    public readString(offset: number, length: number) {
        return this.data.toString('utf-8', offset, offset+ length);
    }

    public readBytes(offset: number, length: number): Uint8Array {
        return new Uint8Array(this.data.buffer.slice(offset, offset + length));
    }
}

export class Me5File extends BinaryFile {
    private readonly ITEM_HEADER_SIZE = 12;
    private readonly GROUP_HEADER_SIZE = 12;

    private groupInfoStartOffset = 9;
    private itemInfoStartOffset: number;

    constructor(path: string) {
        super(path);
    }

    public open(): Promise<void | Buffer> {
        return super.open().then((data) => {
            this.itemInfoStartOffset = this.getGroupCount() * this.GROUP_HEADER_SIZE + this.groupInfoStartOffset;
            return data;
        }, (e: NodeJS.ErrnoException) => {
        });
    }

    public isEncoding(): boolean {
        return this.readByte(0) === 1 ? true : false;
    }

    public getAllItemCount(): number {
        return this.readNumber(1);
    }

    public getGroupCount(): number {
        return this.readNumber(5);
    }

    private getFirstItemIndexInGroup(groupIndex: number) {
        return this.readNumber(this.groupInfoStartOffset + 4 + groupIndex * this.GROUP_HEADER_SIZE);
    }

    private getLastItemIndexInGroup(groupIndex: number) {
        return this.readNumber(this.groupInfoStartOffset + 8 + groupIndex * this.GROUP_HEADER_SIZE);
    }

    public getGroupItemCount(groupIndex: number) {
        return this.getLastItemIndexInGroup(groupIndex) - this.getFirstItemIndexInGroup(groupIndex) + 1;
    }

    private getOffsetByItemIndex(itemIndex: number): number {
        const groupCount = this.getGroupCount();
        return this.readNumber(this.itemInfoStartOffset + itemIndex * this.ITEM_HEADER_SIZE);
    }

    private getItemOffset(groupIndex: number, subItemIndex: number): number {
        const firstItemIndex = this.getFirstItemIndexInGroup(groupIndex);
        return this.getOffsetByItemIndex(firstItemIndex + subItemIndex);
    }

    public getGroupNameLength(groupIndex: number): number {
        return this.readNumber(this.groupInfoStartOffset + groupIndex * this.GROUP_HEADER_SIZE);
    }

    public getItemNameLength(groupIndex: number, subItemIndex: number) {
        const firstItemIndex = this.getFirstItemIndexInGroup(groupIndex);
        return this.readNumber(this.itemInfoStartOffset + 4 + (firstItemIndex + subItemIndex) * this.ITEM_HEADER_SIZE);
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
        const firstItemIndex = this.getFirstItemIndexInGroup(groupIndex);
        return this.readNumber(this.itemInfoStartOffset + 8 + (firstItemIndex + subItemIndex) * this.ITEM_HEADER_SIZE);
    }

    public getItemData(groupIndex: number, subItemIndex: number): Uint8Array {
        const offset = this.getItemOffset(groupIndex, subItemIndex);
        const itemSize = this.getItemSize(groupIndex, subItemIndex);
        const itemNameLength = this.getItemNameLength(groupIndex, subItemIndex);
        return this.readBytes(offset + itemNameLength, itemSize);
    }


}