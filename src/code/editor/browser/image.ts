export class Image {
    private data: Uint8Array;
    private width: number;
    private height: number;
    private type: string;

    constructor(data: Uint8Array) {
        this.data = data;
    }

    public build() {
        if (this.data[0] === 'B'.charCodeAt(0) && this.data[1] === 'M'.charCodeAt(0)) {
            this.type = 'bmp';
        } else if (this.data[0] === 0xFF && this.data[1] === 0xD8) {
            this.type = 'jpg';
        } else if (this.data[0] === 0x89 && this.data[1] === 0x50) {
            this.type = 'png';
        }

        let index = this.data.length;
        const base64 = [];
        while (index--) {
            base64[index] = String.fromCharCode(this.data[index]);
        }
        return btoa(base64.join(''));
    }
}