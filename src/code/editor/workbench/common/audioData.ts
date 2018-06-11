export const enum AudioType {
    Mp3 = 'mpeg',
    Wav = 'wav',
}

export class AudioData {
    private _data: Uint8Array;
    private _type: AudioType;

    constructor() {
    }

    public build(data: Uint8Array) {
        this._data = data;
        this._type = AudioData.getMusicType(this._data);
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

    public get type(): AudioType {
        return this._type;
    }

    public get data(): Uint8Array {
        return this._data;
    }

    static getMusicType(data: Uint8Array): AudioType {
        let type: AudioType;
        if (data[0] === 0x49 && data[1] === 0x44 && data[2] === 0x33) {
            type = AudioType.Mp3;
        } else if (data[0] === 0x52 && data[1] === 0x49 && data[2] === 0x46) {
            type = AudioType.Wav;
        }

        return type;
    }
}