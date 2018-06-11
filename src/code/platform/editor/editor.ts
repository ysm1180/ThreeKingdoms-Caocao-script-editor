export interface IEditorClosedEvent {
    editor: IEditorInput;
}

export interface IEditorInput {
    getId(): any;

    getName(): string;

    getType(): any;

    matches?(other: any): boolean;

    resolve?(): Promise<any>;
}
