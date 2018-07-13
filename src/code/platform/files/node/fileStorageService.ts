import * as path from 'path';
import * as fs from 'fs';
import { isUndefined } from '../../../base/common/types';
import { decorator } from '../../instantiation/instantiation';

export const IFileStorageService = decorator<FileStorageService>('fileStorageService');

export class FileStorage {
    private database: Object;

    constructor(private path: string) {

    }

    private ensureLoaded() {
        if (!this.database) {
            this.database = this.loadSync();
        }
    }

    public getItem(key: string) {
        this.ensureLoaded();

        const value = this.database[key];
        return value;
    }

    public setItem(key: string, value: any) {
        this.ensureLoaded();

        if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') {
            if (this.database[key] === value) {
                return;
            }
        }

        this.database[key] = value;
        this.saveSync();
    }

    public removeItem(key: string) {
        this.ensureLoaded();

        if (!isUndefined(this.database[key])) {
            this.database[key] = void 0;
            this.saveSync();
        }
    }

    private loadSync(): Object {
        try {
            return JSON.parse(fs.readFileSync(this.path).toString());
        } catch {
           return {};
        }
    }

    private saveSync() {
        const data = JSON.stringify(this.database, null, 4);

        const fd = fs.openSync(this.path, 'w');
        fs.writeFileSync(fd, data);
        fs.fdatasyncSync(fd);
        fs.closeSync(fd);
    }
}

export class FileStorageService {
    private fileStorage: FileStorage;

    constructor(userDataPath: string) {
        this.fileStorage = new FileStorage(path.join(userDataPath, 'storage.json'));
    }

    public get(key: string) {
        return this.fileStorage.getItem(key);
    }

    public store(key: string, value: any): void {
        this.fileStorage.setItem(key, value);
    }

    public remove(key: string): void {
        this.fileStorage.removeItem(key);
    }
}