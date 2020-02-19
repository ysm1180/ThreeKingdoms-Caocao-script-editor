import { Graph } from '../../base/common/graph';
import { ClassDescriptor } from './descriptors';
import { IInstantiationService, ServiceIdentifier, ServicesAccessor, init } from './instantiation';
import { ServiceStorage } from './serviceStorage';

function create(ctor: any, ...args: any[]): any {
  return new ctor(...args);
}

export class InstantiationService implements IInstantiationService {
  _serviceBrand: any;
  private services: ServiceStorage;

  constructor(services = new ServiceStorage()) {
    this.services = services;

    this.services.set(IInstantiationService, this);
  }

  createChild(services: ServiceStorage): IInstantiationService {
    this.services.forEach((id, thing) => {
      if (services.has(id)) {
        return;
      }
      if (thing instanceof ClassDescriptor) {
        thing = this._createAndCacheServiceInstance(id, thing);
      }
      services.set(id, thing);
    });
    return new InstantiationService(services);
  }

  public create(param: any, ...rest: any[]): any {
    if (param instanceof ClassDescriptor) {
      return this._create(param, rest);
    } else {
      return this._create(new ClassDescriptor(param), rest);
    }
  }

  private _create<T>(descriptor: ClassDescriptor<T>, args: any[]): T {
    const staticArgs = descriptor.staticArguments.concat(args);
    const serviceArgs: any[] = [];
    const services = init.getService(descriptor.ctor).sort((a, b) => a.index - b.index);
    for (const service of services) {
      const instant = this._getOrCreateServiceInstance(service.id);
      serviceArgs.push(instant);
    }

    const arg = [descriptor.ctor];
    arg.push(...staticArgs);
    arg.push(...serviceArgs);

    return create.apply(undefined, arg);
  }

  public invokeFunction<R>(fn: (accessor: ServicesAccessor) => R, ...args: any[]) {
    let accessor: ServicesAccessor;
    accessor = {
      get: <T>(id: ServiceIdentifier<T>) => {
        return this._getOrCreateServiceInstance(id);
      },
    };
    return fn.apply(fn, [accessor].concat(args));
  }

  private _getOrCreateServiceInstance<T>(id: ServiceIdentifier<T>): T {
    const instant = this.services.get(id);
    if (instant instanceof ClassDescriptor) {
      return this._createAndCacheServiceInstance(id, instant);
    } else {
      return instant;
    }
  }

  private _createAndCacheServiceInstance<T>(id: ServiceIdentifier<T>, desc: ClassDescriptor<T>): T {
    const graph = new Graph<{
      id: ServiceIdentifier<any>;
      desc: ClassDescriptor<any>;
    }>((data) => data.id.toString());

    let count = 0;
    const stack = [{ id, desc }];
    while (stack.length) {
      const item = stack.pop();
      graph.lookupOrInsertNode(item);

      if (count++ > 100) {
        const err = new Error('[createInstance] cyclic dependency between services');
        err.message = graph.toString();
        throw err;
      }

      // check all dependencies for existence and if the need to be created first
      let dependencies = init.getService(item.desc.ctor);
      for (let dependency of dependencies) {
        let instanceOrDesc = this.services.get(dependency.id);
        if (!instanceOrDesc) {
          console.warn(`[createInstance] ${id} depends on ${dependency.id} which is NOT registered.`);
        }

        if (instanceOrDesc instanceof ClassDescriptor) {
          const d = { id: dependency.id, desc: instanceOrDesc };
          graph.insertEdge(item, d);
          stack.push(d);
        }
      }
    }

    while (true) {
      let roots = graph.roots();

      // if there is no more roots but still
      // nodes in the graph we have a cycle
      if (roots.length === 0) {
        if (graph.length !== 0) {
          const err = new Error('[createInstance] cyclic dependency between services');
          err.message = graph.toString();
          throw err;
        }
        break;
      }

      for (let root of roots) {
        const instance = this._create(root.data.desc, []);
        this.services.set(root.data.id, instance);
        graph.removeNode(root.data);
      }
    }

    return <T>this.services.get(id);
  }
}
