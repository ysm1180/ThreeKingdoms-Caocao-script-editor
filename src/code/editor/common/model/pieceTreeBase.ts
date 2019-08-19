import { CharCode } from '../../../base/common/charCode';
import {
    fixInsert, leftest, NodeColor, righttest, SENTINEL, TreeNode
} from './pieceTreeTextBuffer/rbTree';

export function createUintArray(arr: number[]): Uint32Array | Uint16Array {
    let r;
    if (arr[arr.length - 1] < 65536) {
        r = new Uint16Array(arr.length);
    } else {
        r = new Uint32Array(arr.length);
    }
    r.set(arr, 0);
    return r;
}

export function createLineStartsFast(
    str: string,
    readonly: boolean = true
): Uint32Array | Uint16Array | number[] {
    let r: number[] = [0],
        rLength = 1;

    for (let i = 0, len = str.length; i < len; i++) {
        const chr = str.charCodeAt(i);

        if (chr === CharCode.CarriageReturn) {
            if (i + 1 < len && str.charCodeAt(i + 1) === CharCode.LineFeed) {
                // \r\n... case
                r[rLength++] = i + 2;
                i++; // skip \n
            } else {
                // \r... case
                r[rLength++] = i + 1;
            }
        } else if (chr === CharCode.LineFeed) {
            r[rLength++] = i + 1;
        }
    }
    if (readonly) {
        return createUintArray(r);
    } else {
        return r;
    }
}

export interface BufferCursor {
    /**
     * Line number in current buffer
     */
    line: number;
    /**
     * Column number in current buffer
     */
    column: number;
}

export class Piece {
    readonly bufferIndex: number;
    readonly start: BufferCursor;
    readonly end: BufferCursor;
    readonly length: number;
    readonly lineFeedCnt: number;

    constructor(
        bufferIndex: number,
        start: BufferCursor,
        end: BufferCursor,
        lineFeedCnt: number,
        length: number
    ) {
        this.bufferIndex = bufferIndex;
        this.start = start;
        this.end = end;
        this.lineFeedCnt = lineFeedCnt;
        this.length = length;
    }
}

export class StringBuffer {
    buffer: string;
    lineStarts: Uint32Array | Uint16Array | number[];

    constructor(
        buffer: string,
        lineStarts: Uint32Array | Uint16Array | number[]
    ) {
        this.buffer = buffer;
        this.lineStarts = lineStarts;
    }
}

export class PieceTreeBase {
    public root: TreeNode;
    private buffers: StringBuffer[];
    private length: number;
    private lineCount: number;

    constructor(chunks: StringBuffer[]) {
        this.create(chunks);
    }

    private create(chunks: StringBuffer[]) {
        this.buffers = [new StringBuffer('', [0])];
        this.root = SENTINEL;
        this.length = 0;
        this.lineCount = 1;

        let lastNode: TreeNode = null;
        for (let i = 0, len = chunks.length; i < len; i++) {
            if (chunks[i].buffer.length > 0) {
                if (!chunks[i].lineStarts) {
                    chunks[i].lineStarts = createLineStartsFast(
                        chunks[i].buffer
                    );
                }

                let piece = new Piece(
                    i + 1,
                    { line: 0, column: 0 },
                    {
                        line: chunks[i].lineStarts.length - 1,
                        column:
                            chunks[i].buffer.length -
                            chunks[i].lineStarts[
                                chunks[i].lineStarts.length - 1
                            ],
                    },
                    chunks[i].lineStarts.length - 1,
                    chunks[i].buffer.length
                );
                this.buffers.push(chunks[i]);
                lastNode = this.rbInsertRight(lastNode, piece);
            }
        }

        this.computeBufferMetaData();
    }

    public getLinesContent(): string[] {
        return this.getContentOfSubTree(this.root).split(/\r|\n|\r\n/);
    }

    public getLineContent(lineNumber: number): string {
        if (lineNumber === this.lineCount) {
            return this.getLineRawContent(lineNumber);
        } else {
            return this.getLineRawContent(lineNumber).replace(
                /(\r\n|\r|\n)$/,
                ''
            );
        }
    }

    private getLineRawContent(lineNumber: number): string {
        let x = this.root;

        let ret = '';
        while (x !== SENTINEL) {
            if (x.left !== SENTINEL && x.lf_left >= lineNumber - 1) {
                x = x.left;
            } else if (x.lf_left + x.piece.lineFeedCnt > lineNumber - 1) {
                const prevAccumualtedValue = this.getAccumulatedValue(
                    x,
                    lineNumber - x.lf_left - 2
                );
                const accumualtedValue = this.getAccumulatedValue(
                    x,
                    lineNumber - x.lf_left - 1
                );
                const startOffset = this.offsetInBuffer(
                    x.piece.bufferIndex,
                    x.piece.start
                );
                const buffer = this.buffers[x.piece.bufferIndex].buffer;

                return buffer.substring(
                    startOffset + prevAccumualtedValue,
                    startOffset + accumualtedValue
                );
            } else if (x.lf_left + x.piece.lineFeedCnt === lineNumber - 1) {
                let prevAccumualtedValue = this.getAccumulatedValue(
                    x,
                    lineNumber - x.lf_left - 2
                );
                let buffer = this.buffers[x.piece.bufferIndex].buffer;
                let startOffset = this.offsetInBuffer(
                    x.piece.bufferIndex,
                    x.piece.start
                );

                ret = buffer.substring(
                    startOffset + prevAccumualtedValue,
                    startOffset + x.piece.length
                );
                break;
            } else {
                lineNumber -= x.lf_left + x.piece.lineFeedCnt;
                x = x.right;
            }
        }

        x = x.next();
        while (x !== SENTINEL) {
            const buffer = this.buffers[x.piece.bufferIndex].buffer;

            if (x.piece.lineFeedCnt > 0) {
                const accumualtedValue = this.getAccumulatedValue(x, 0);
                const startOffset = this.offsetInBuffer(
                    x.piece.bufferIndex,
                    x.piece.start
                );

                ret += buffer.substring(
                    startOffset,
                    startOffset + accumualtedValue
                );
                return ret;
            } else {
                const startOffset = this.offsetInBuffer(
                    x.piece.bufferIndex,
                    x.piece.start
                );
                ret += buffer.substr(startOffset, x.piece.length);
            }

            x = x.next();
        }

        return ret;
    }

    private getAccumulatedValue(node: TreeNode, index: number) {
        if (index < 0) {
            return 0;
        }
        let piece = node.piece;
        let lineStarts = this.buffers[piece.bufferIndex].lineStarts;
        let expectedLineStartIndex = piece.start.line + index + 1;
        if (expectedLineStartIndex > piece.end.line) {
            return (
                lineStarts[piece.end.line] +
                piece.end.column -
                lineStarts[piece.start.line] -
                piece.start.column
            );
        } else {
            return (
                lineStarts[expectedLineStartIndex] -
                lineStarts[piece.start.line] -
                piece.start.column
            );
        }
    }

    public getLength(): number {
        return this.length;
    }

    public getLineCount(): number {
        return this.lineCount;
    }

    private rbInsertRight(node: TreeNode, p: Piece): TreeNode {
        let z = new TreeNode(p, NodeColor.Red);
        z.left = SENTINEL;
        z.right = SENTINEL;
        z.parent = SENTINEL;
        z.size_left = 0;
        z.lf_left = 0;

        let x = this.root;
        if (x === SENTINEL) {
            this.root = z;
            z.color = NodeColor.Black;
        } else if (node.right === SENTINEL) {
            node.right = z;
            z.parent = node;
        } else {
            let nextNode = leftest(node.right);
            nextNode.left = z;
            z.parent = nextNode;
        }

        fixInsert(this, z);
        return z;
    }

    private rbInsertLeft(node: TreeNode, p: Piece): TreeNode {
        let z = new TreeNode(p, NodeColor.Red);
        z.left = SENTINEL;
        z.right = SENTINEL;
        z.parent = SENTINEL;
        z.size_left = 0;
        z.lf_left = 0;

        let x = this.root;
        if (x === SENTINEL) {
            this.root = z;
            z.color = NodeColor.Black;
        } else if (node.left === SENTINEL) {
            node.left = z;
            z.parent = node;
        } else {
            let prevNode = righttest(node.left);
            prevNode.right = z;
            z.parent = prevNode;
        }

        fixInsert(this, z);
        return z;
    }

    private computeBufferMetaData() {
        let x = this.root;

        let lfCnt = 1;
        let len = 0;

        while (x !== SENTINEL) {
            lfCnt += x.lf_left + x.piece.lineFeedCnt;
            len += x.size_left + x.piece.length;
            x = x.right;
        }

        this.lineCount = lfCnt;
        this.length = len;
    }

    private offsetInBuffer(bufferIndex: number, cursor: BufferCursor): number {
        let lineStarts = this.buffers[bufferIndex].lineStarts;
        return lineStarts[cursor.line] + cursor.column;
    }

    private iterate(
        node: TreeNode,
        callback: (node: TreeNode) => boolean
    ): boolean {
        if (node === SENTINEL) {
            return callback(SENTINEL);
        }

        let leftRet = this.iterate(node.left, callback);
        if (!leftRet) {
            return leftRet;
        }

        return callback(node) && this.iterate(node.right, callback);
    }

    private getNodeContent(node: TreeNode) {
        if (node === SENTINEL) {
            return '';
        }
        let buffer = this.buffers[node.piece.bufferIndex];
        let currentContent;
        let piece = node.piece;
        let startOffset = this.offsetInBuffer(piece.bufferIndex, piece.start);
        let endOffset = this.offsetInBuffer(piece.bufferIndex, piece.end);
        currentContent = buffer.buffer.substring(startOffset, endOffset);
        return currentContent;
    }

    private getContentOfSubTree(node: TreeNode): string {
        let str = '';

        this.iterate(node, node => {
            str += this.getNodeContent(node);
            return true;
        });

        return str;
    }
}
