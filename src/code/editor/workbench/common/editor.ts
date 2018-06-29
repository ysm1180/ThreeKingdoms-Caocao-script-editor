import { IEditorInput } from 'code/platform/editor/editor';
import * as path from 'path';

export class FileEditorInput implements IEditorInput {
    private resource: string;

    constructor(url: string, private isNewFile: boolean) {
        this.resource = url;
        this.isNewFile = !!this.isNewFile;
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

    public resolve(): Promise<boolean> {
        return Promise.resolve().then(() => {
            const original = this.isNewFile;
            this.isNewFile = true;
            return original;
        });
    }

}