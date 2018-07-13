export class BinaryDataEditorModel {
    constructor(
        private base64Data: string,
    ) {
        
    }

    public getResource(): string {
        return this.base64Data;
    }
}