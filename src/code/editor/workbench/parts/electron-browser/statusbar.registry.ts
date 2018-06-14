import { StatusbarRegistry, StatusbarItemAlignment, StatusbarItemDescriptor } from 'code/platform/statusbar/statusbar';
import { ContextKeyExpr } from 'code/platform/contexts/contextKey';
import { Me5ActiveItemKey } from '../../browser/parts/editor/me5ItemViewEditor';
import { Me5ItemType } from '../files/me5Data';
import { ImageViewStatus } from '../../browser/parts/editor/me5ImageViewStatus';


StatusbarRegistry.registerStatusbarItem(new StatusbarItemDescriptor(ImageViewStatus, ImageViewStatus.ID, StatusbarItemAlignment.LEFT, ContextKeyExpr.equal(Me5ActiveItemKey, Me5ItemType.Image)));
