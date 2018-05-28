import { IEditorInput } from 'code/platform/editor/editor';
import * as path from 'path';


export class FileEditorInput implements IEditorInput {
    private resource: string;

    constructor(url: string) {
        this.resource = url;
    }

    public getName(): string {
        return path.basename(this.resource);
    }

    public getId(): string {
        return this.resource;
    }

    public matches(other: IEditorInput) {
        if (this === other) {
            return true;
        }

        return this.resource === other.getId();
    }

    public getType() : string {
        return path.extname(this.resource).slice(1);
    }

}