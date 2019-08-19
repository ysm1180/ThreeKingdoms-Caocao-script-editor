export const enum KeyCode {
    Backspace = 8,
    Tab = 9,
    Enter = 13,
    Shift = 16,
    Control = 17,
    Alt = 18,
    PauseBreak = 19,
    CapsLock = 20,
    Escape = 27,
    Space = 32,
    PageUp = 33,
    PageDown = 34,
    End = 35,
    Home = 36,
    LeftArrow = 37,
    UpArrow = 38,
    RightArrow = 39,
    DownArrow = 40,
    Insert = 45,
    Delete = 46,

    KEY_0 = 48,
    KEY_1 = 49,
    KEY_2 = 50,
    KEY_3 = 51,
    KEY_4 = 52,
    KEY_5 = 53,
    KEY_6 = 54,
    KEY_7 = 55,
    KEY_8 = 56,
    KEY_9 = 57,

    KEY_A = 65,
    KEY_B = 66,
    KEY_C = 67,
    KEY_D = 68,
    KEY_E = 69,
    KEY_F = 70,
    KEY_G = 71,
    KEY_H = 72,
    KEY_I = 73,
    KEY_J = 74,
    KEY_K = 75,
    KEY_L = 76,
    KEY_M = 77,
    KEY_N = 78,
    KEY_O = 79,
    KEY_P = 80,
    KEY_Q = 81,
    KEY_R = 82,
    KEY_S = 83,
    KEY_T = 84,
    KEY_U = 85,
    KEY_V = 86,
    KEY_W = 87,
    KEY_X = 88,
    KEY_Y = 89,
    KEY_Z = 90,

    ContextMenu = 93,

    F1 = 112,
    F2 = 113,
    F3 = 114,
    F4 = 115,
    F5 = 116,
    F6 = 117,
    F7 = 118,
    F8 = 119,
    F9 = 120,
    F10 = 121,
    F11 = 122,
    F12 = 123,
}

class KeyCodeStringMap {
    private _keyCodeToString: string[];
    private _stringToKeyCode: { [str: string]: KeyCode };

    constructor() {
        this._keyCodeToString = [];
        this._stringToKeyCode = {};
    }

    public define(keyCode: KeyCode, str: string): void {
        this._keyCodeToString[keyCode] = str;
        this._stringToKeyCode[str] = keyCode;
    }

    public keyCodeToString(keyCode: KeyCode): string {
        return this._keyCodeToString[keyCode];
    }

    public stringToKeyCode(str: string): KeyCode {
        return this._stringToKeyCode[str] || null;
    }
}

const generalMap = new KeyCodeStringMap();

(function() {
    generalMap.define(KeyCode.Backspace, 'Backspace');
    generalMap.define(KeyCode.Tab, 'Tab');
    generalMap.define(KeyCode.Enter, 'Enter');
    generalMap.define(KeyCode.Shift, 'Shift');
    generalMap.define(KeyCode.Control, 'Ctrl');
    generalMap.define(KeyCode.Alt, 'Alt');
    generalMap.define(KeyCode.PauseBreak, 'PauseBreak');
    generalMap.define(KeyCode.CapsLock, 'CapsLock');
    generalMap.define(KeyCode.Escape, 'Escape');
    generalMap.define(KeyCode.Space, 'Space');
    generalMap.define(KeyCode.PageUp, 'PageUp');
    generalMap.define(KeyCode.PageDown, 'PageDown');
    generalMap.define(KeyCode.End, 'End');
    generalMap.define(KeyCode.Home, 'Home');

    generalMap.define(KeyCode.LeftArrow, 'Left');
    generalMap.define(KeyCode.UpArrow, 'Up');
    generalMap.define(KeyCode.RightArrow, 'Right');
    generalMap.define(KeyCode.DownArrow, 'Down');

    generalMap.define(KeyCode.Insert, 'Insert');
    generalMap.define(KeyCode.Delete, 'Delete');

    generalMap.define(KeyCode.KEY_0, '0');
    generalMap.define(KeyCode.KEY_1, '1');
    generalMap.define(KeyCode.KEY_2, '2');
    generalMap.define(KeyCode.KEY_3, '3');
    generalMap.define(KeyCode.KEY_4, '4');
    generalMap.define(KeyCode.KEY_5, '5');
    generalMap.define(KeyCode.KEY_6, '6');
    generalMap.define(KeyCode.KEY_7, '7');
    generalMap.define(KeyCode.KEY_8, '8');
    generalMap.define(KeyCode.KEY_9, '9');

    generalMap.define(KeyCode.KEY_A, 'A');
    generalMap.define(KeyCode.KEY_B, 'B');
    generalMap.define(KeyCode.KEY_C, 'C');
    generalMap.define(KeyCode.KEY_D, 'D');
    generalMap.define(KeyCode.KEY_E, 'E');
    generalMap.define(KeyCode.KEY_F, 'F');
    generalMap.define(KeyCode.KEY_G, 'G');
    generalMap.define(KeyCode.KEY_H, 'H');
    generalMap.define(KeyCode.KEY_I, 'I');
    generalMap.define(KeyCode.KEY_J, 'J');
    generalMap.define(KeyCode.KEY_K, 'K');
    generalMap.define(KeyCode.KEY_L, 'L');
    generalMap.define(KeyCode.KEY_M, 'M');
    generalMap.define(KeyCode.KEY_N, 'N');
    generalMap.define(KeyCode.KEY_O, 'O');
    generalMap.define(KeyCode.KEY_P, 'P');
    generalMap.define(KeyCode.KEY_Q, 'Q');
    generalMap.define(KeyCode.KEY_R, 'R');
    generalMap.define(KeyCode.KEY_S, 'S');
    generalMap.define(KeyCode.KEY_T, 'T');
    generalMap.define(KeyCode.KEY_U, 'U');
    generalMap.define(KeyCode.KEY_V, 'V');
    generalMap.define(KeyCode.KEY_W, 'W');
    generalMap.define(KeyCode.KEY_X, 'X');
    generalMap.define(KeyCode.KEY_Y, 'Y');
    generalMap.define(KeyCode.KEY_Z, 'Z');

    generalMap.define(KeyCode.F1, 'F1');
    generalMap.define(KeyCode.F2, 'F2');
    generalMap.define(KeyCode.F3, 'F3');
    generalMap.define(KeyCode.F4, 'F4');
    generalMap.define(KeyCode.F5, 'F5');
    generalMap.define(KeyCode.F6, 'F6');
    generalMap.define(KeyCode.F7, 'F7');
    generalMap.define(KeyCode.F8, 'F8');
    generalMap.define(KeyCode.F9, 'F9');
    generalMap.define(KeyCode.F10, 'F10');
    generalMap.define(KeyCode.F11, 'F11');
    generalMap.define(KeyCode.F12, 'F12');
})();

export const enum KeyMode {
    Ctrl = 1 << 8,
    Alt = 1 << 9,
    Shift = 1 << 10,
}

export namespace KeyCodeUtils {
    export function toString(keyCode: KeyCode): string {
        return generalMap.keyCodeToString(keyCode);
    }
}

export class Keybinding {
    public readonly ctrlKey: boolean;
    public readonly shiftKey: boolean;
    public readonly altKey: boolean;
    public readonly keyCode: KeyCode;

    constructor(
        ctrlKey: boolean,
        shiftKey: boolean,
        altKey: boolean,
        keyCode: KeyCode
    ) {
        this.ctrlKey = ctrlKey;
        this.shiftKey = shiftKey;
        this.altKey = altKey;
        this.keyCode = keyCode;
    }

    public equals(other: Keybinding): boolean {
        return (
            this.ctrlKey === other.ctrlKey &&
            this.shiftKey === other.shiftKey &&
            this.altKey === other.altKey &&
            this.keyCode === other.keyCode
        );
    }

    public electronShortKey(): string {
        let result = '';
        if (this.ctrlKey) {
            result += 'Ctrl+';
        }

        if (this.altKey) {
            result += 'Alt+';
        }

        if (this.shiftKey) {
            result += 'Shift+';
        }

        return result + KeyCodeUtils.toString(this.keyCode);
    }
}
