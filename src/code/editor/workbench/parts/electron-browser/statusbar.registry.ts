import {
    StatusbarItemAlignment, StatusbarItemDescriptor, StatusbarRegistry
} from '../../../../platform/statusbar/statusbar';
import { me5ExplorerItemContext } from '../../browser/parts/me5Explorer';
import { ImageViewStatusItem } from '../../browser/parts/statusbar/me5ImageViewStatus';

StatusbarRegistry.registerStatusbarItem(
    new StatusbarItemDescriptor(
        ImageViewStatusItem,
        ImageViewStatusItem.ID,
        StatusbarItemAlignment.LEFT,
        me5ExplorerItemContext
    )
);
