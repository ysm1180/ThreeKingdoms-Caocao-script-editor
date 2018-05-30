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
    let byteLen = 0;
    for (let i = 0, len = value.length; i < len; i++) {
        const code = value.charCodeAt(i);
        if (code <= 0xff) {
            byteLen = byteLen + 1;
        } else {
            byteLen = byteLen + 2;
        }
    }

    return byteLen;
}

export function strToBytes(value: string): Uint8Array {
    const byteLen = getByteLength(value);

    const encode = new Uint8Array(byteLen);
    let index = 0;
    for (let i = 0, len = value.length; i < len; i++) {
        const code = value.charCodeAt(i);
        if (code <= 0xff) {
            encode[index++] = code;
        } else {
            encode[index++] = code >> 8;
            encode[index++] = code & 0xff;
        }
    }

    return encode;
}