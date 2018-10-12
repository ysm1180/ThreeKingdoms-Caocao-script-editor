export namespace Schemas {
	export const file: string = 'file';
	export const untitled: string = 'untitled';
	export const data: string = 'data';
}


export default class URI {
    public readonly scheme: string;
    public readonly path: string;
    
    constructor(scheme: string, path: string) {
        this.scheme = scheme;
        this.path = path;
    }
}