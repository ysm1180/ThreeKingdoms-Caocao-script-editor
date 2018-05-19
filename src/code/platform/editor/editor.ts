export interface IEditorInput {
    getResource(): any;

    getName(): string;

    getType(): string;

    matches?(other: any): boolean;

    resolve?(): Promise<any>;
}
