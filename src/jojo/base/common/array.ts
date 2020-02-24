'use strict';

export function coalesce<T>(array: T[]): T[] {
  if (!array) {
    return array;
  }

  return array.filter((e) => !!e);
}
