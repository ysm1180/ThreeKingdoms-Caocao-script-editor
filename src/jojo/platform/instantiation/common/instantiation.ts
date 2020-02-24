import * as descriptors from 'jojo/platform/instantiation/common/descriptors';
import { ServiceStorage } from 'jojo/platform/instantiation/common/serviceStorage';

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

  export function getService(ctor: any): { id: ServiceIdentifier<any>; index: number }[] {
    return ctor[SERVICE] || [];
  }
}

export interface IConstructorSignature0<T> {
  new (...services: any[]): T;
}

export interface IConstructorSignature1<A1, T> {
  new (first: A1, ...services: any[]): T;
}

export interface IConstructorSignature2<A1, A2, T> {
  new (first: A1, second: A2, ...services: any[]): T;
}

export interface IConstructorSignature3<A1, A2, A3, T> {
  new (first: A1, second: A2, third: A3, ...services: any[]): T;
}

export interface IConstructorSignature4<A1, A2, A3, A4, T> {
  new (first: A1, second: A2, third: A3, fourth: A4, ...services: any[]): T;
}

export interface IConstructorSignature5<A1, A2, A3, A4, A5, T> {
  new (first: A1, second: A2, third: A3, fourth: A4, fifth: A5, ...services: any[]): T;
}

export interface IConstructorSignature6<A1, A2, A3, A4, A5, A6, T> {
  new (first: A1, second: A2, third: A3, fourth: A4, fifth: A5, sixth: A6, ...services: any[]): T;
}

export interface IConstructorSignature7<A1, A2, A3, A4, A5, A6, A7, T> {
  new (first: A1, second: A2, third: A3, fourth: A4, fifth: A5, sixth: A6, seventh: A7, ...services: any[]): T;
}

export interface IConstructorSignature8<A1, A2, A3, A4, A5, A6, A7, A8, T> {
  new (
    first: A1,
    second: A2,
    third: A3,
    fourth: A4,
    fifth: A5,
    sixth: A6,
    seventh: A7,
    eigth: A8,
    ...services: any[]
  ): T;
}

export const IInstantiationService = decorator<IInstantiationService>('instantiationService');

export interface IInstantiationService {
  create<T>(descriptor: descriptors.ClassDescriptor0<T>): T;
  create<A1, T>(descriptor: descriptors.ClassDescriptor1<A1, T>, a1: A1): T;
  create<A1, A2, T>(descriptor: descriptors.ClassDescriptor2<A1, A2, T>, a1: A1, a2: A2): T;
  create<A1, A2, A3, T>(descriptor: descriptors.ClassDescriptor3<A1, A2, A3, T>, a1: A1, a2: A2, a3: A3): T;
  create<A1, A2, A3, A4, T>(
    descriptor: descriptors.ClassDescriptor4<A1, A2, A3, A4, T>,
    a1: A1,
    a2: A2,
    a3: A3,
    a4: A4
  ): T;
  create<A1, A2, A3, A4, A5, T>(
    descriptor: descriptors.ClassDescriptor5<A1, A2, A3, A4, A5, T>,
    a1: A1,
    a2: A2,
    a3: A3,
    a4: A4,
    a5: A5
  ): T;
  create<A1, A2, A3, A4, A5, A6, T>(
    descriptor: descriptors.ClassDescriptor6<A1, A2, A3, A4, A5, A6, T>,
    a1: A1,
    a2: A2,
    a3: A3,
    a4: A4,
    a5: A5,
    a6: A6
  ): T;
  create<A1, A2, A3, A4, A5, A6, A7, T>(
    descriptor: descriptors.ClassDescriptor7<A1, A2, A3, A4, A5, A6, A7, T>,
    a1: A1,
    a2: A2,
    a3: A3,
    a4: A4,
    a5: A5,
    a6: A6,
    a7: A7
  ): T;
  create<A1, A2, A3, A4, A5, A6, A7, A8, T>(
    descriptor: descriptors.ClassDescriptor8<A1, A2, A3, A4, A5, A6, A7, A8, T>,
    a1: A1,
    a2: A2,
    a3: A3,
    a4: A4,
    a5: A5,
    a6: A6,
    a7: A7,
    a8: A8
  ): T;

  create<T>(ctor: IConstructorSignature0<T>): T;
  create<A1, T>(ctor: IConstructorSignature1<A1, T>, first: A1): T;
  create<A1, A2, T>(ctor: IConstructorSignature2<A1, A2, T>, first: A1, second: A2): T;
  create<A1, A2, A3, T>(ctor: IConstructorSignature3<A1, A2, A3, T>, first: A1, second: A2, third: A3): T;
  create<A1, A2, A3, A4, T>(
    ctor: IConstructorSignature4<A1, A2, A3, A4, T>,
    first: A1,
    second: A2,
    third: A3,
    fourth: A4
  ): T;
  create<A1, A2, A3, A4, A5, T>(
    ctor: IConstructorSignature5<A1, A2, A3, A4, A5, T>,
    first: A1,
    second: A2,
    third: A3,
    fourth: A4,
    fifth: A5
  ): T;
  create<A1, A2, A3, A4, A5, A6, T>(
    ctor: IConstructorSignature6<A1, A2, A3, A4, A5, A6, T>,
    first: A1,
    second: A2,
    third: A3,
    fourth: A4,
    fifth: A5,
    sixth: A6
  ): T;
  create<A1, A2, A3, A4, A5, A6, A7, T>(
    ctor: IConstructorSignature7<A1, A2, A3, A4, A5, A6, A7, T>,
    first: A1,
    second: A2,
    third: A3,
    fourth: A4,
    fifth: A5,
    sixth: A6,
    seventh: A7
  ): T;
  create<A1, A2, A3, A4, A5, A6, A7, A8, T>(
    ctor: IConstructorSignature8<A1, A2, A3, A4, A5, A6, A7, A8, T>,
    first: A1,
    second: A2,
    third: A3,
    fourth: A4,
    fifth: A5,
    sixth: A6,
    seventh: A7,
    eigth: A8
  ): T;

  createChild(services: ServiceStorage): IInstantiationService;

  invokeFunction<R>(fn: (accessor: ServicesAccessor) => R, ...args: any[]);
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
