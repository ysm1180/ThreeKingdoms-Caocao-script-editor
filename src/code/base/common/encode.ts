export function encodeToBase64(data: Uint8Array) {
    if (data.length > 0) {
        let index = data.length;
        const base64 = [];
        while (index--) {
            base64[index] = String.fromCharCode(data[index]);
        }
        return btoa(base64.join(''));
    }

    return null;
}

export function decodeFromBase64(base64: string): Uint8Array {
    var str = window.atob(base64);
    var len = str.length;
    var bytes = new Uint8Array(len);
    for (var i = 0; i < len; i++) {
        bytes[i] = str.charCodeAt(i);
    }
    return bytes;
}