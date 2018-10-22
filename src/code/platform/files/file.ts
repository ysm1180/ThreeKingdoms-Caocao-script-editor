import * as path from 'path';
import * as fs from 'fs';
import * as Convert from '../../base/common/convert';

export namespace Files {
    export const me5 = 'me5';
    export const lua = 'lua';
    export const dlg = 'dlg';
}

export class BinaryFile {
    public data: Buffer = Buffer.alloc(0);
    private _path: string;

    constructor(path: string) {
        this._path = path;
    }

    public get path(): string {
        return this._path;
    }

    public get ext(): string {
        return path.extname(this._path).substr(1).toLowerCase();
    }

    public get name(): string {
        return path.basename(this._path).replace(path.extname(this._path), '');
    }

    public open(): Promise<BinaryFile> {
        return new Promise<BinaryFile>((c, e) => {
            fs.readFile(this._path, {}, (err, data) => {
                if (err) {
                    e(err);
                    return null;
                }

                this.data = data;

                c(this);
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
        return this.data.toString('utf-8', offset, offset + length);
    }

    public readBytes(offset: number, length: number): Uint8Array {
        return new Uint8Array(this.data.buffer.slice(offset, offset + length));
    }

    public write(offset: number, length: number, data: Uint8Array) {
        if (this.data.length <= offset + length) {
            const buffer = new Uint8Array(offset + length);
            buffer.set(this.data, 0);
            this.data = Buffer.from(buffer.buffer);
        }

        for (let i = 0; i < length; i++) {
            this.data[offset + i] = data[i];
        }

        const fd = fs.openSync(this._path, 'w');
        const bytes = new Uint8Array(this.data.slice(0));
        fs.writeSync(fd, bytes, 0, bytes.length, 0);
        fs.fdatasyncSync(fd);
        fs.closeSync(fd);
    }

    public writeInt(offset: number, data: number) {
        this.write(offset, 4, Convert.intToBytes(data));
    }
}