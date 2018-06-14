import { bytesToNumber } from 'code/base/common/convert';

export const enum ImageType {
    Png = 'png',
    Bmp = 'bmp',
    Jpg = 'jpg',
}

export class ImageData {
    private _data: Uint8Array;
    private _width: number;
    private _height: number;
    private _type: ImageType;

    constructor() {
    }

    public build(data: Uint8Array) {
        this._data = data;
        this._type = ImageData.getImageType(this._data);
        
        if (this._type === ImageType.Png) {
            this._width = bytesToNumber(this.data.slice(16), true);
            this._height = bytesToNumber(this.data.slice(20), true);
        }
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

    public get type(): ImageType {
        return this._type;
    }

    public get data(): Uint8Array {
        return this._data;
    }

    public get width(): number {
        return this._width;
    }

    public get height(): number {
        return this._height;
    }

    static getImageType(data: Uint8Array): ImageType {
        let type: ImageType;
        if (data[0] === 'B'.charCodeAt(0) && data[1] === 'M'.charCodeAt(0)) {
            type = ImageType.Bmp;
        } else if (data[0] === 0xFF && data[1] === 0xD8) {
            type = ImageType.Jpg;
        } else if (data[0] === 0x89 && data[1] === 0x50) {
            type = ImageType.Png;
        } else {
            type = null;
        }

        return type;
    }
}