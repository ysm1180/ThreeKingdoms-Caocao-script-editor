export class BinaryFileEditorDataModel {

    constructor(
        private resource: string,
    ) {
        
    }

    public getResource(): string {
        return this.resource;
    }

    public load() {

    }
}

export class TextEditorDataModel {
    constructor(
        private resource: string,
    ) {

    }

    public getResource(): string {
        return this.resource;
    }
}