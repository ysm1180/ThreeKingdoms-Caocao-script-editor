import {
  StatusbarItemAlignment,
  StatusbarItemDescriptor,
  StatusbarRegistry,
} from '../../../platform/statusbar/statusbar';

import { ImageViewStatusItem } from '../../browser/parts/statusbar/me5ImageViewStatus';
import { me5ExplorerItemContext } from '../../browser/parts/me5Explorer';

StatusbarRegistry.registerStatusbarItem(
  new StatusbarItemDescriptor(
    ImageViewStatusItem,
    ImageViewStatusItem.ID,
    StatusbarItemAlignment.LEFT,
    me5ExplorerItemContext
  )
);
