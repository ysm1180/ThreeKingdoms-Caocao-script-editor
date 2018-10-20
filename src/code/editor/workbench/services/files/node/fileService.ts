import * as iconv from 'iconv-lite';
import * as fs from 'fs';
import { IStreamContent, IContent, IContentData } from '../../../../../platform/files/files';
import { IFileService } from '../files';

export class FileService implements IFileService {
    constructor(
    ) {

    }

    public resolveContent(resource: string): Promise<IContent> {
        return this.resolveStream(resource).then((stream) => {
            return new Promise<IContent>((resolve, reject) => {
                const result: IContent = {
                    value: '',
                };

                stream.value.on('data', (chunk) => result.value += chunk);
                stream.value.on('end', () => resolve(result));
                stream.value.on('error', (err) => reject(err));

                return result;
            });
        });
    }

    public resolveStream(resource: string): Promise<IStreamContent> {
        const result: IStreamContent = {
            value: void 0,
        };

        return this.fillContents(result, resource).then(() => result);
    }

    private fillContents(content: IStreamContent, resource: string) {
        return this.resolveFileData(resource).then((data: IContentData) => {
            content.value = data.stream;
        });
    }

    private resolveFileData(resource: string) {
        const result: IContentData = {
            stream: void 0,
        };

        return new Promise<IContentData>((resolve, reject) => {
            fs.open(resource, 'r', (err, fd) => {
                if (err) {
                    return reject(err);
                }

                let decoder: NodeJS.ReadWriteStream;
                const chunkBuffer = Buffer.alloc(1024 * 64);

                const finish = () => {
                    if (decoder) {
                        decoder.end();
                    }
                };

                const handleChunk = (bytesRead) => {
                    if (bytesRead === 0) {
                        finish();
                    } else if (bytesRead < chunkBuffer.length) {
                        decoder.write(chunkBuffer.slice(0, bytesRead), readChunk);
                    } else {
                        decoder.write(chunkBuffer, readChunk);
                    }
                };

                const readChunk = () => {
                    fs.read(fd, chunkBuffer, 0, chunkBuffer.length, null, (err, bytesRead) => {
                        if (decoder) {
                            handleChunk(bytesRead);
                        } else {
                            result.stream = decoder = iconv.decodeStream('utf8');
                            resolve(result);
                            handleChunk(bytesRead);
                        }
                    });
                };

                readChunk();
            });
        });
    }
}