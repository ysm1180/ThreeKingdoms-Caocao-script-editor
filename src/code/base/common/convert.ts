export function intToBytes(value: number): Uint8Array {
    const result = new Uint8Array(4);
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

export function strToBytes(value: string): Uint8Array {
    const encode = Buffer.from(value);
    return new Uint8Array(encode);
}

export function bytesToNumber(bytes: Uint8Array, bigEndian: boolean = false): number {
    if (bigEndian) {
        bytes = bytes.slice(0, 0 + 4).reverse();     
    }

    return new Uint32Array(bytes.buffer.slice(0, 0 + 4))[0];
}