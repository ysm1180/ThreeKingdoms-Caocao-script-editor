import * as fs from 'fs';
import * as path from 'path';
import { isBuffer } from 'util';

import * as Convert from '../../base/common/convert';
import { isString } from '../../base/common/types';

export namespace Files {
    export const me5 = 'me5';
    export const lua = 'lua';
    export const dlg = 'dlg';
}

export class BinaryFile {
    public data: Buffer = Buffer.alloc(0);
    protected _path: string;
    protected tempData: { buffer: Buffer; offset: number }[];
    protected dataSize: number;

    constructor(resource: string | Buffer) {
        if (isString(resource)) {
            this._path = resource;
        } else if (isBuffer(resource)) {
            this._path = null;
            this.data = resource;
        }
    }

    public get path(): string {
        return this._path;
    }

    public get ext(): string {
        if (this._path) {
            return path
                .extname(this._path)
                .substr(1)
                .toLowerCase();
        }

        return null;
    }

    public get name(): string {
        if (this._path) {
            return path
                .basename(this._path)
                .replace(path.extname(this._path), '');
        }

        return null;
    }

    public open(): Promise<BinaryFile> {
        if (this._path) {
            return new Promise<BinaryFile>((c, e) => {
                fs.open(this._path, 'r', (openError, fd) => {
                    if (openError) {
                        return e(openError);
                    }

                    fs.readFile(fd, (readError, data) => {
                        if (readError) {
                            return e(readError);
                        }

                        this.data = data;

                        fs.close(fd, closeError => {
                            if (closeError) {
                                return e(closeError);
                            }

                            c(this);
                        });
                    });
                });
            }).then(
                result => {
                    return result;
                },
                err => {
                    console.error(err);
                    return null;
                }
            );
        } else if (this.data.length > 0) {
            return Promise.resolve(this);
        } else {
            return Promise.reject(new Error('the path or data is empty'));
        }
    }

    public readNumber(offset: number): number {
        const bytes = this.data.buffer.slice(
            this.data.byteOffset + offset,
            this.data.byteOffset + offset + 4
        );
        const number = new Uint32Array(bytes);
        return number[0];
    }

    public readByte(offset: number): number {
        return this.data.buffer[this.data.byteOffset + offset];
    }

    public readString(offset: number, length: number) {
        return this.data.toString('utf-8', offset, offset + length);
    }

    public readBytes(offset: number, length: number): Uint8Array {
        return new Uint8Array(
            this.data.buffer.slice(
                this.data.byteOffset + offset,
                this.data.byteOffset + offset + length
            )
        );
    }

    public write(offset: number, length: number, data: Buffer) {
        this.tempData.push({
            offset,
            buffer: data,
        });
        this.dataSize += length;
    }

    public finish(fd: number): Promise<void> {
        return new Promise((c, e) => {
            this.data = Buffer.alloc(this.dataSize);
            this.tempData.forEach(element => {
                this.data.set(element.buffer, element.offset);
            });
            this.tempData = [];

            fs.write(fd, this.data, writeError => {
                if (writeError) {
                    return fs.close(fd, () => e(writeError));
                }

                fs.fdatasync(fd, syncError => {
                    if (syncError) {
                        console.warn(
                            '[node.js fs] fdatasync is now disabled for this session because it failed: ',
                            syncError
                        );
                        return e(syncError);
                    }

                    fs.close(fd, closeError => {
                        if (closeError) {
                            return e(closeError);
                        }

                        return c();
                    });
                });
            });
        });
    }

    public writeInt(offset: number, data: number) {
        this.write(offset, 4, Convert.intToBytes(data));
    }
}
