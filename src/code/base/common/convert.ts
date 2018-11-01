export function intToBytes(value: number): Buffer {
    const result = Buffer.alloc(4);
    let i = 0;
    do {
        result[i++] = value & 0xff;
        value = value >> 8;
    } while (i < 4);

    return result;
}

export function getByteLength(value: string): number {
    const byteLen = Buffer.from(value).length;
    return byteLen;
}

export function strToBytes(value: string): Buffer {
    return Buffer.from(value);
}

export function bytesToNumber(bytes: Uint8Array, bigEndian: boolean = false): number {
    if (bigEndian) {
        bytes = bytes.slice(0, 0 + 4).reverse();     
    }

    return new Uint32Array(bytes.buffer.slice(0, 0 + 4))[0];
}