import { ContextKeyExpr } from '../contexts/contextKey';
import { decorator } from '../instantiation/instantiation';

export const enum StatusbarItemAlignment {
  LEFT,
  RIGHT,
}

export interface IStatusbarEntry {
  alignment: StatusbarItemAlignment;
  priority?: number;
  when?: ContextKeyExpr;
}

export const IStatusbarService = decorator<IStatusbarService>('statusbarService');

export interface IStatusbarService {}
