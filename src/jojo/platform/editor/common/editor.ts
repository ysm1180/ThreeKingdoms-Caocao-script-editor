export interface IEditorInput {
  getResource(): any;

  getName(): string;

  matches(other: any): boolean;

  resolve(refresh?: boolean): Promise<any>;

  getPreferredEditorId(): string;

  isSaving(): boolean;

  isLoaded(): boolean;
}

export interface IResourceInput {
  resource: string;

  label?: string;
}

export interface IUntitleResourceInput {
  resource?: string;

  label?: string;
}
