export const enum AudioType {
    Mp3 = 'mpeg',
    Wav = 'wav',
}

export class AudioResource {
    private _data: Uint8Array;
    private _type: AudioType;

    constructor() {
    }

    public build(data: Uint8Array) {
        this._data = data;
        this._type = AudioResource.getTypeFromBinary(this._data);
    }

    public get type(): AudioType {
        return this._type;
    }

    public get data(): Uint8Array {
        return this._data;
    }

    public static getTypeFromBinary(data: Uint8Array): AudioType {
        let type: AudioType;
        if (data[0] === 0x49 && data[1] === 0x44 && data[2] === 0x33) {
            type = AudioType.Mp3;
        } else if (data[0] === 0x52 && data[1] === 0x49 && data[2] === 0x46) {
            type = AudioType.Wav;
        }

        return type;
    }
}