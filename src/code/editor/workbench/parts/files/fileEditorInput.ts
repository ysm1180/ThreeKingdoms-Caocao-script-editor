import * as path from 'path';
import { IEditorInput } from '../../../../platform/editor/editor';
import { Me5ItemViewEditor } from '../../browser/parts/editor/me5/me5ItemViewEditor';
import { TextFileEditor } from '../../browser/parts/editor/textFileEditor';
import { IInstantiationService, InstantiationService } from '../../../../platform/instantiation/instantiationService';
import { BinaryDataEditorModel } from '../../browser/parts/editor/binaryDataEditorModel';

const _regExp = /^([a-zA-z]:[\/\\].*)\?(.*)$/;

export class FileEditorInput implements IEditorInput {
    protected resource: string;
    protected forceUseExtraData: boolean;

    constructor(
        resource: string,
        @IInstantiationService private instantiationService: InstantiationService,
    ) {
        this.resource = resource;
        this.forceUseExtraData = false;
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

    public resolve(): Promise<BinaryDataEditorModel> {
        return Promise.resolve().then(() => {
            const matches = _regExp.exec(this.resource);
            if (matches) {
                const extraData = matches[2] || null;
                if (extraData) {
                    return this.instantiationService.create(BinaryDataEditorModel, extraData);
                }
            }

            return null;
        });
    }

    public getPreferredEditorId(): string {
        return this.forceUseExtraData ? Me5ItemViewEditor.ID : TextFileEditor.ID;
    }

    public setUseExtraData(value: boolean) {
        this.forceUseExtraData = value;
    }
}