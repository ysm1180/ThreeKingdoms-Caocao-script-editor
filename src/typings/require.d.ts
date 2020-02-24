declare const define: {
  (moduleName: string, dependencies: string[], callback: (...args: any[]) => any): any;
  (moduleName: string, dependencies: string[], definition: any): any;
  (moduleName: string, callback: (...args: any[]) => any): any;
  (moduleName: string, definition: any): any;
  (dependencies: string[], callback: (...args: any[]) => any): any;
  (dependencies: string[], definition: any): any;
};

interface NodeRequire {
  toUrl(path: string): string;
  (dependencies: string[], callback: (...args: any[]) => any, errorback?: (err: any) => void): any;
  config(data: any): any;
  onError: Function;
  __$__nodeRequire<T>(moduleName: string): T;
}

declare var require: NodeRequire;
