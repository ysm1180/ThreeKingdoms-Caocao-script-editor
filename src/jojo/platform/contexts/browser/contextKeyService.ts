import { isUndefined } from 'jojo/base/common/types';
import { IContext, IContextKeyService } from 'jojo/platform/contexts/common/contextKey';

export class Context implements IContext {
  private value: { [key: string]: any };

  constructor() {
    this.value = {};
  }

  public setValue(key: string, value: any): boolean {
    if (this.value[key] !== value) {
      this.value[key] = value;
      return true;
    }
    return false;
  }

  public getValue<T>(key: string): T {
    return this.value[key];
  }

  public removeValue(key: string): boolean {
    if (key in this.value) {
      delete this.value[key];
      return true;
    }
    return false;
  }
}

export class ContextKey<T> {
  constructor(private parent: ContextKeyService, private key: string, private defaultValue: T) {
    this.reset();
  }

  public set(value: T) {
    this.parent.setContext(this.key, value);
  }

  public reset() {
    if (isUndefined(this.defaultValue)) {
      this.parent.removeContext(this.key);
    } else {
      this.parent.setContext(this.key, this.defaultValue);
    }
  }

  public get(): T {
    return this.parent.getContextKeyValue<T>(this.key);
  }
}

export class ContextKeyService implements IContextKeyService {
  private context: Context;

  constructor() {
    this.context = new Context();
  }

  public setContext(key: string, value: any) {
    this.context.setValue(key, value);
  }

  public getContextKeyValue<T>(key: string): T {
    return this.context.getValue<T>(key);
  }

  public removeContext(key: string) {
    this.context.removeValue(key);
  }

  public createKey<T>(key: string, defaultValue: T) {
    return new ContextKey<T>(this, key, defaultValue);
  }

  public getContext(): Context {
    return this.context;
  }
}
