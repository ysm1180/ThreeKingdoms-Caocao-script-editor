export interface IEditorInput {
    getId(): any;

    getName(): string;

    getType(): string;

    matches?(other: any): boolean;

    resolve?(): Promise<any>;
}
