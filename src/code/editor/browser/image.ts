export class Image {
    private _data: Uint8Array;
    private width: number;
    private height: number;
    private _type: string;

    constructor() {
    }

    public build(data: Uint8Array) {
        this._data = data;
        this._type = Image.getImageType(this._data);
    }

    public encodeToBase64() {
        if (this._type !== null) {
            let index = this._data.length;
            const base64 = [];
            while (index--) {
                base64[index] = String.fromCharCode(this._data[index]);
            }
            return btoa(base64.join(''));
        }

        return null;
    }

    public get type(): string {
        return this._type;
    }

    public get data(): Uint8Array {
        return this._data;
    }

    static getImageType(data: Uint8Array): string {
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