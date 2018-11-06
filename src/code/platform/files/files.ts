export interface IContentData {
    stream: IStringStream;
}

export interface IContent {
    value: string;
}

export interface IStringStream {
    on(event: 'data', callback: (chunk: string) => void): void;
	on(event: 'error', callback: (err: any) => void): void;
	on(event: 'end', callback: () => void): void;
	on(event: string, callback: any): void;
}

export interface IStreamContent {
    value: IStringStream;
}

export enum StateChange {
	DIRTY,
	SAVING,
	SAVED,
	SAVE_ERROR,
}