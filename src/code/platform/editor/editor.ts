export interface IEditorInput {
    getId(): any;

    getName(): string;

    matches(other: any): boolean;

    resolve(refresh?: boolean): Promise<any>;

    getPreferredEditorId(): string;
}

export interface IResourceInput {
    resource: string;

    label?: string;
}

export interface IUntitleResourceInput {
    resource?: string;

    label?: string;


}