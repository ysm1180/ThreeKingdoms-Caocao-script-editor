'use strict';

import { IDoneIterator } from './iterator';

class Node<E> {
    element: E;
    next: Node<E>;
    prev: Node<E>;

    constructor(element: E) {
        this.element = element;
    }
}

export class LinkedList<E> {

    private _first: Node<E>;
    private _last: Node<E>;

    isEmpty(): boolean {
        return !this._first;
    }

    clear(): void {
        this._first = undefined;
        this._last = undefined;
    }

    unshift(element: E) {
        return this.insert(element, false);
    }

    push(element: E) {
        return this.insert(element, true);
    }

    insertBefore(element: E, elementAfter: E = this._last.element) {
        let iter, target;
        let targetNode;

        for (iter = this.iterator(), target = iter.next(); !target.done; target = iter.next()) {
            if (target.value === elementAfter) {
                targetNode = target.node;
                break;
            }
        }

        if (target.done) {
            targetNode = this._last;
        } 

        const newNode = new Node(element);
        if (!targetNode) {
            this._first = newNode;
            this._last = newNode;
        } else  {
            newNode.prev = targetNode.prev;
            newNode.next = targetNode;
            if (targetNode.prev) {
                targetNode.prev.next = newNode;
            }
            targetNode.prev = newNode;

            if (this._first.prev === newNode) {
                this._first = newNode;
            }
        }

        return () => {
            for (let candidate = this._first; candidate instanceof Node; candidate = candidate.next) {
                if (candidate !== newNode) {
                    continue;
                }
                if (candidate.prev && candidate.next) {
                    // middle
                    let anchor = candidate.prev;
                    anchor.next = candidate.next;
                    candidate.next.prev = anchor;

                } else if (!candidate.prev && !candidate.next) {
                    // only node
                    this._first = undefined;
                    this._last = undefined;

                } else if (!candidate.next) {
                    // last
                    this._last = this._last.prev;
                    this._last.next = undefined;

                } else if (!candidate.prev) {
                    // first
                    this._first = this._first.next;
                    this._first.prev = undefined;
                }

                // done
                break;
            }
        };
    }

    private insert(element: E, atTheEnd: boolean) {
        const newNode = new Node(element);
        if (!this._first) {
            this._first = newNode;
            this._last = newNode;

        } else if (atTheEnd) {
            // push
            const oldLast = this._last;
            this._last = newNode;
            newNode.prev = oldLast;
            oldLast.next = newNode;

        } else {
            // unshift
            const oldFirst = this._first;
            this._first = newNode;
            newNode.next = oldFirst;
            oldFirst.prev = newNode;
        }

        return () => {

            for (let candidate = this._first; candidate instanceof Node; candidate = candidate.next) {
                if (candidate !== newNode) {
                    continue;
                }
                if (candidate.prev && candidate.next) {
                    // middle
                    let anchor = candidate.prev;
                    anchor.next = candidate.next;
                    candidate.next.prev = anchor;

                } else if (!candidate.prev && !candidate.next) {
                    // only node
                    this._first = undefined;
                    this._last = undefined;

                } else if (!candidate.next) {
                    // last
                    this._last = this._last.prev;
                    this._last.next = undefined;

                } else if (!candidate.prev) {
                    // first
                    this._first = this._first.next;
                    this._first.prev = undefined;
                }

                // done
                break;
            }
        };
    }

    iterator(): IDoneIterator<E> {
        let element = {
            done: undefined,
            value: undefined,
            node: undefined,
        };
        let node = this._first;
        return {
            next(): { done: boolean; value: E, node: Node<E> } {
                if (!node) {
                    element.done = true;
                    element.value = undefined;
                    element.node = undefined;
                } else {
                    element.done = false;
                    element.value = node.element;
                    element.node = node;
                    node = node.next;
                }
                return element;
            }
        };
    }

    toArray(): E[] {
        let result: E[] = [];
        for (let node = this._first; node instanceof Node; node = node.next) {
            result.push(node.element);
        }
        return result;
    }
}
