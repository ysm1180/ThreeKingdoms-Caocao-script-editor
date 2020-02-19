import { StatusbarItemAlignment } from '../../../platform/statusbar/statusbar';
import { me5ExplorerItemContext } from '../../browser/parts/editor/me5Explorer';
import { ImageViewStatusItem } from '../../browser/parts/editor/me5ImageViewStatus';
import { StatusbarItemDescriptor, StatusbarRegistry } from '../../browser/parts/statusbar/statusbar';

StatusbarRegistry.registerStatusbarItem(
  new StatusbarItemDescriptor(
    ImageViewStatusItem,
    ImageViewStatusItem.ID,
    StatusbarItemAlignment.LEFT,
    me5ExplorerItemContext
  )
);
