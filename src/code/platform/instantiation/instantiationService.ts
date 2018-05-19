import { ServiceStorage } from 'code/platform/instantiation/serviceStorage';
import { ClassDescriptor } from 'code/platform/instantiation/descriptor';
import { decorator, init } from 'code/platform/instantiation/instantiation';

export const IInstantiationService = decorator<InstantiationService>('instantiationService');

function create(ctor: any, ...args: any[]): any {
    return new ctor(...args);
}

export class InstantiationService  {
    _serviceBrand: any;
    private services: ServiceStorage;

    constructor(services = new ServiceStorage()) {
        this.services = services;

        this.services.set(IInstantiationService, this);
    }

    public create(param: any, ...rest: any[]): any {
        return this._create(new ClassDescriptor(param), rest);
    }

    private _create<T>(descriptor: ClassDescriptor<T>, args: any[]): T {
        const staticArgs = [].concat(args);
        const serviceArgs: any[] = [];
        const services = init.getService(descriptor.ctor).sort((a, b) => a.index - b.index);
        for (const service of services) {
            const instant = this.services.get(service.id);
            serviceArgs.push(instant);
        }

        const arg = [descriptor.ctor];
        arg.push(...staticArgs);
        arg.push(...serviceArgs);

        return create.apply(undefined, arg);
    }
}