const _typeof = {
  object: 'object',
  string: 'string',
  number: 'number',
  function: 'function',
};

export function isArray(array: any): array is any[] {
  if (Array.isArray) {
    return Array.isArray(array);
  }

  if (array && typeof array.length === _typeof.number && array.constructor === Array) {
    return true;
  }

  return false;
}

export function isObject(o: any): boolean {
  return typeof o === _typeof.object && o !== null && !Array.isArray(o);
}

export function isString(o: any): o is string {
  return typeof o === _typeof.string || o instanceof String;
}

export function isNull(o: any): boolean {
  return o === null;
}

export function isUndefined(o: any): boolean {
  return o === undefined;
}

export function isNullOrUndefined(o: any): boolean {
  return isNull(o) || isUndefined(o);
}

export function isEmptyObject(obj: any): obj is any {
  if (!isObject(obj)) {
    return false;
  }

  for (let key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      return false;
    }
  }

  return true;
}
