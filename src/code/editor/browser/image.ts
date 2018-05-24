export class Image {
    private data: Uint8Array;
    private width: number;
    private height: number;
    private type: string;

    constructor() {
    }

    public build(data: Uint8Array) {
        this.data = data;
        this.type = Image.getType(this.data);
    }

    public encodeToBase64() {
        if (this.type !== null) {
            let index = this.data.length;
            const base64 = [];
            while (index--) {
                base64[index] = String.fromCharCode(this.data[index]);
            }
            return btoa(base64.join(''));
        }
    }
    static getType(data: Uint8Array): string {
        let type: string;
        if (data[0] === 'B'.charCodeAt(0) && data[1] === 'M'.charCodeAt(0)) {
            type = 'bmp';
        } else if (data[0] === 0xFF && data[1] === 0xD8) {
            type = 'jpg';
        } else if (data[0] === 0x89 && data[1] === 0x50) {
            type = 'png';
        } else {
            type = null;
        }

        return type;
    }
}