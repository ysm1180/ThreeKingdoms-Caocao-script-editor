import * as bmp from 'bmp-js';
import * as jpeg from 'jpeg-js';
import * as sharp from 'sharp';
import { bytesToNumber } from '../../../base/common/convert';


export const enum ImageType {
    Png = 'png',
    Bmp = 'bmp',
    Jpg = 'jpg',
}

export class ImageResource {
    private _data: Uint8Array;
    private _width: number;
    private _height: number;
    private _type: ImageType;

    constructor() {
        this._width = 0;
        this._height = 0;
    }

    public build(data: Uint8Array): boolean {
        this._type = ImageResource.getTypeFromBinary(data);

        if (!this._type) {
            return false;
        }

        this._data = data;

        if (this._type === ImageType.Png) {
            this._width = bytesToNumber(this.data.slice(16), true);
            this._height = bytesToNumber(this.data.slice(20), true);
        } else if (this._type === ImageType.Jpg) {
            const jpg = jpeg.decode(this.data);
            this._width = jpg.width;
            this._height = jpg.height;
        }

        return true;
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

    public static getTypeFromBinary(data: Uint8Array): ImageType {
        let type: ImageType = null;
        if (data) {
            if (data[0] === 'B'.charCodeAt(0) && data[1] === 'M'.charCodeAt(0)) {
                type = ImageType.Bmp;
            } else if (data[0] === 0xFF && data[1] === 0xD8) {
                type = ImageType.Jpg;
            } else if (data[0] === 0x89 && data[1] === 0x50) {
                type = ImageType.Png;
            } 
        }

        return type;
    }

    public static convertToJpeg(data: Buffer): Promise<Uint8Array> {
        return Promise.resolve().then(() => {
            const type = ImageResource.getTypeFromBinary(data);

            const jpegOption = {
                quality: 100,
                chromaSubsampling: '4:4:4',
            };
            if (type === ImageType.Jpg) {
                return sharp(data).jpeg(jpegOption).toBuffer();
            } else if (type === ImageType.Bmp) {
                const bitmap = bmp.decode(data);
                for (let i = 0; i < bitmap.data.length / 4; i++) {
                    let temp = bitmap.data[i * 4];
                    bitmap.data[i * 4] = bitmap.data[i * 4 + 3];
                    bitmap.data[i * 4 + 3] = 0xFF;

                    temp = bitmap.data[i * 4 + 1];
                    bitmap.data[i * 4 + 1] = bitmap.data[i * 4 + 2];
                    bitmap.data[i * 4 + 2] = temp;
                }

                return sharp(bitmap.data, {
                    raw: {
                        width: bitmap.width,
                        height: bitmap.height,
                        channels: 4,
                    },
                }).jpeg(jpegOption).toBuffer();
            } else if (type === ImageType.Png) {
                return sharp(data).jpeg(jpegOption).toBuffer();
            } else {
                return data;
            }
        });
    }

    public static convertToPng(data: Buffer): Promise<Uint8Array> {
        return Promise.resolve().then(() => {
            const type = ImageResource.getTypeFromBinary(data);

            if (type === ImageType.Png) {
                return data;
            } else if (type === ImageType.Bmp) {
                const bitmap = bmp.decode(data);
                for (let i = 0; i < bitmap.data.length / 4; i++) {
                    let temp = bitmap.data[i * 4];
                    bitmap.data[i * 4] = bitmap.data[i * 4 + 3];
                    bitmap.data[i * 4 + 3] = 0xFF;

                    temp = bitmap.data[i * 4 + 1];
                    bitmap.data[i * 4 + 1] = bitmap.data[i * 4 + 2];
                    bitmap.data[i * 4 + 2] = temp;
                }

                return sharp(bitmap.data, {
                    raw: {
                        width: bitmap.width,
                        height: bitmap.height,
                        channels: 4,
                    },
                }).png().toBuffer();
            } else if (type === ImageType.Jpg) {
                return sharp(data).png().toBuffer();
            } else {
                return data;
            }
        });
    }
}