import { ContextKeyExpr } from 'jojo/platform/contexts/common/contextKey';
import { decorator } from 'jojo/platform/instantiation/common/instantiation';

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
