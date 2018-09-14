import * as fs from 'fs';
import * as Convert from '../../base/common/convert';

export namespace Files {
    export const me5 = 'me5';
    export const lua = 'lua';
    export const dlg = 'dlg';
}

export class BinaryFile {
    public data: Buffer = new Buffer([]);
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
        return this.data.toString('utf-8', offset, offset + length);
    }

    public readBytes(offset: number, length: number): Uint8Array {
        return new Uint8Array(this.data.buffer.slice(offset, offset + length));
    }

    public write(offset: number, length: number, data: Uint8Array) {
        if (this.data.length <= offset + length) {
            const buffer = new Uint8Array(offset + length);
            buffer.set(this.data, 0);
            this.data = new Buffer(buffer);
        }

        for (let i = 0; i < length; i++) {
            this.data[offset + i] = data[i];
        }

        const fd = fs.openSync(this.path, 'w');
        const bytes = new Uint8Array(this.data.slice(0));
        fs.writeSync(fd, bytes, 0, bytes.length, 0);
        fs.fdatasyncSync(fd);
        fs.closeSync(fd);
    }

    public writeInt(offset: number, data: number) {
        this.write(offset, 4, Convert.intToBytes(data));
    }
}