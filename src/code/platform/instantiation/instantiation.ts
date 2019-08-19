export interface ServiceIdentifier<T> {
    (...args: any[]): void;
    type: T;
}

export interface ServicesAccessor {
    get<T>(id: ServiceIdentifier<T>): T;
}

export namespace init {
    export const TARGET = '$target';
    export const SERVICE = '$services';

    export const services = new Map<string, any>();

    export function storeService(id: any, target: any, index: number) {
        if (target[TARGET] === target) {
            target[SERVICE].push({ id, index });
        } else {
            target[SERVICE] = [{ id, index }];
            target[TARGET] = target;
        }
    }

    export function getService(
        ctor: any
    ): { id: ServiceIdentifier<any>; index: number }[] {
        return ctor[SERVICE] || [];
    }
}

export function decorator<T>(serviceId: string): ServiceIdentifier<T> {
    if (init.services.has(serviceId)) {
        return init.services.get(serviceId);
    }

    const id = <any>function(target: any, key: any, index: number) {
        init.storeService(id, target, index);
    };
    id.toString = () => serviceId;

    init.services.set(serviceId, id);

    return id;
}
