import * as path from 'path';
import { IEditorInput } from '../../../../platform/editor/editor';
import { TextFileEditor } from '../../browser/parts/editor/textFileEditor';
import { ResourceViewEditor } from '../../browser/parts/editor/binaryViewEditor';

const _regExp = /^([a-zA-z]:[\/\\].*)\?(.*)$/;

export class FileEditorInput implements IEditorInput {
    protected resource: string;
    protected forceOpenBinary: boolean;

    constructor(
        resource: string,
    ) {
        this.resource = resource;

        this.forceOpenBinary = false;
    }

    public getName(): string {
        return this.resource ? path.basename(this.resource) : 'untitled';
    }

    public getId(): string {
        const matches = _regExp.exec(this.resource);
        if (!matches) {
            return this.resource;
        } else {
            return matches[1];
        }
    }

    public matches(other: IEditorInput) {
        if (this === other) {
            return true;
        }

        return this.getId() === other.getId();
    }

    public resolve(): Promise<any> {
        return Promise.resolve().then(() => {
            return null;
        });
    }

    public getPreferredEditorId(): string {
        return this.forceOpenBinary ? ResourceViewEditor.ID : TextFileEditor.ID;
    }

    public setForceOpenAsBinary() {
        this.forceOpenBinary = true;
    }
}