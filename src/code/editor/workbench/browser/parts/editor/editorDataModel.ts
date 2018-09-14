export class ResourceFileEditorDataModel {

    constructor(
        private resource: string,
    ) {

    }

    public getResource(): string {
        return this.resource;
    }
}
