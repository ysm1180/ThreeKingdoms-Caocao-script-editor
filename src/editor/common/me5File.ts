import * as Convert from '../../base/common/convert';
import * as electron from 'electron';
import * as fs from 'fs';

import { FilterFuntion, IResourceStat } from '../workbench/services/resourceFile/resourceDataService';

import { BinaryFile } from '../../platform/files/file';
import { ImageResource } from '../workbench/common/imageResource';
import { Me5Stat } from '../workbench/parts/files/me5Data';
import { isBuffer } from 'util';

export class Me5File extends BinaryFile {
  public static readonly ALL_ITEM_COUNT_OFFSET = 1;
  public static readonly GROUP_COUNT_OFFSET = 5;

  public static readonly ITEM_HEADER_SIZE = 12;
  public static readonly GROUP_HEADER_SIZE = 12;

  public static readonly GROUP_INFO_START_OFFSET = 9;
  private itemInfoStartOffset: number;

  constructor(resource: string | Buffer) {
    super(resource);

    if (isBuffer(resource)) {
      this.itemInfoStartOffset = this.getGroupCount() * Me5File.GROUP_HEADER_SIZE + Me5File.GROUP_INFO_START_OFFSET;
    }
  }

  public open(): Promise<BinaryFile> {
    return super.open().then(
      () => {
        this.itemInfoStartOffset = this.getGroupCount() * Me5File.GROUP_HEADER_SIZE + Me5File.GROUP_INFO_START_OFFSET;
        return this;
      },
      (e: NodeJS.ErrnoException) => {
        return null;
      }
    );
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

  public getGroupOffset(groupIndex: number): number {
    let offset = this.getItemOffset(groupIndex, 0);
    const length = this.getGroupNameLength(groupIndex);
    offset -= length;
    return offset;
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
    const length = this.getGroupNameLength(groupIndex);
    return this.readString(this.getGroupOffset(groupIndex), length);
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

  public async save(stat: IResourceStat, groupFilter?: FilterFuntion<IResourceStat>) {
    return new Promise<void>((c1, e) => {
      fs.open(this._path, 'w', (openError, fd) => {
        if (openError) {
          return e(openError);
        }

        this.tempData = [];
        this.dataSize = 0;

        const groups = stat.getChildren(groupFilter);

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
          setGroupPromises.push(
            () =>
              new Promise((c, e) => {
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

                setItemPromises
                  .reduce((cur, next) => {
                    return cur
                      .then((offset) => {
                        return next(offset);
                      })
                      .then((changedOffset) => {
                        offset = changedOffset;
                        return offset;
                      });
                  }, Promise.resolve(offset))
                  .then(() => {
                    baseItemIndex += items.length;
                    c();
                  });
              })
          );
        }

        setGroupPromises
          .reduce((cur, next) => {
            return cur.then(next);
          }, Promise.resolve())
          .then(() => {
            this.finish(fd).then(() => {
              c1();
            });
          });
      });
    });
  }

  private _setAllItemCount(count: number) {
    this.writeInt(Me5File.ALL_ITEM_COUNT_OFFSET, count);
  }

  private _setGroupCount(count: number) {
    this.writeInt(Me5File.GROUP_COUNT_OFFSET, count);
  }

  private _setGroupInfo(group: IResourceStat, baseItemIndex: number, filter?: FilterFuntion<Me5Stat>) {
    const offset = Me5File.GROUP_INFO_START_OFFSET + group.getIndex(filter) * Me5File.GROUP_HEADER_SIZE;
    this.writeInt(offset + 4, baseItemIndex); // Item Begin Index
    this.writeInt(offset + 8, baseItemIndex + group.getChildren().length - 1); // Item End Index
    this.writeInt(offset, Convert.getByteLength(group.name));
  }

  private _setItemInfo(item: IResourceStat, baseItemIndex: number, filter?: FilterFuntion<Me5Stat>) {
    const offset = this.itemInfoStartOffset + (baseItemIndex + item.getIndex(filter)) * Me5File.ITEM_HEADER_SIZE;
    this.writeInt(offset, 0); // item offset
    this.writeInt(offset + 4, Convert.getByteLength(item.name));
    this.writeInt(offset + 8, 0); // item size
  }

  private _setGroup(offset: number, group: IResourceStat): number {
    const name = group.name;
    const length = Convert.getByteLength(name);

    this.write(offset, length, Convert.strToBytes(name));

    return length;
  }

  private _setItem(
    offset: number,
    item: IResourceStat,
    baseItemIndex: number,
    filter?: FilterFuntion<Me5Stat>
  ): Promise<number> {
    const name = item.name;
    const length = Convert.getByteLength(name);

    const startItemOffset =
      this.itemInfoStartOffset + (baseItemIndex + item.getIndex(filter)) * Me5File.ITEM_HEADER_SIZE;
    this.writeInt(startItemOffset, offset);
    this.write(offset, length, Convert.strToBytes(name));

    const remote = electron.remote;
    const appMenu = remote.Menu.getApplicationMenu();
    const saveToPngMenuItem = appMenu.getMenuItemById('option.saveToPng');
    let convertPromise: Promise<Buffer>;
    if (saveToPngMenuItem.checked) {
      const pngCompressOption = appMenu.getMenuItemById('option.maxCompressPng');
      convertPromise = ImageResource.convertToPng(item.data, pngCompressOption.checked);
    } else {
      convertPromise = ImageResource.convertToJpeg(item.data);
    }

    return convertPromise.then((data) => {
      this.writeInt(startItemOffset + 8, data.length);
      this.write(offset + length, data.length, data);

      return Promise.resolve(length + data.length);
    });
  }
}
