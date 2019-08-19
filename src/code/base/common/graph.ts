import { isEmptyObject } from './types';

export interface Node<T> {
    data: T;
    incoming: { [key: string]: Node<T> };
    outgoing: { [key: string]: Node<T> };
}

function newNode<T>(data: T): Node<T> {
    return {
        data: data,
        incoming: Object.create(null),
        outgoing: Object.create(null),
    };
}
export class Graph<T> {
    private nodes: { [key: string]: Node<T> } = Object.create(null);

    constructor(private hashFn: (element: T) => string) {}

    public roots(): Node<T>[] {
        const ret: Node<T>[] = [];
        for (let key in this.nodes) {
            if (Object.prototype.hasOwnProperty.call(this.nodes, key)) {
                const entry = { key: key, value: this.nodes[key] };
                if (isEmptyObject(entry.value.outgoing)) {
                    ret.push(entry.value);
                }
            }
        }
        return ret;
    }

    public insertEdge(from: T, to: T): void {
        const fromNode = this.lookupOrInsertNode(from),
            toNode = this.lookupOrInsertNode(to);

        fromNode.outgoing[this.hashFn(to)] = toNode;
        toNode.incoming[this.hashFn(from)] = fromNode;
    }

    public removeNode(data: T): void {
        const removedKey = this.hashFn(data);
        delete this.nodes[removedKey];
        for (let key in this.nodes) {
            if (Object.prototype.hasOwnProperty.call(this.nodes, key)) {
                const entry = { key: key, value: this.nodes[key] };
                delete entry.value.outgoing[removedKey];
                delete entry.value.incoming[removedKey];
            }
        }
    }

    public lookupOrInsertNode(data: T): Node<T> {
        const key = this.hashFn(data);
        let node = this.nodes[key];

        if (!node) {
            node = newNode(data);
            this.nodes[key] = node;
        }

        return node;
    }

    public lookup(data: T): Node<T> {
        return this.nodes[this.hashFn(data)];
    }

    public get length(): number {
        return Object.keys(this.nodes).length;
    }

    toString(): string {
        let data: string[] = [];
        for (let key in this.nodes) {
            if (Object.prototype.hasOwnProperty.call(this.nodes, key)) {
                const entry = { key: key, value: this.nodes[key] };
                data.push(
                    `${entry.key}, (incoming)[${Object.keys(
                        entry.value.incoming
                    ).join(', ')}], (outgoing)[${Object.keys(
                        entry.value.outgoing
                    ).join(',')}]`
                );
            }
        }
        return data.join('\n');
    }
}
