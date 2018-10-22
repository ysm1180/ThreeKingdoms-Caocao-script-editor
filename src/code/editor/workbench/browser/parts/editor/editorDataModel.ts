export class ResourceFileEditorModel {

    constructor(
        private resource: string,
    ) {

    }

    public getResource(): string {
        return this.resource;
    }
}
