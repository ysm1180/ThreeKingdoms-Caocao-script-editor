import { ServiceIdentifier } from 'jojo/platform/instantiation/common/instantiation';

export class ServiceStorage {
  private entries = new Map<ServiceIdentifier<any>, any>();

  constructor() {}

  public has(key: ServiceIdentifier<any>) {
    return this.entries.has(key);
  }

  public set(key: ServiceIdentifier<any>, value: any) {
    this.entries.set(key, value);
  }

  public get<T>(key: ServiceIdentifier<T>): T {
    return this.entries.get(key);
  }

  public forEach(callback: (id: ServiceIdentifier<any>, instanceOrDescriptor: any) => any): void {
    this.entries.forEach((value, key) => callback(key, value));
  }
}
