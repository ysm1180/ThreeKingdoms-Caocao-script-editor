import { StatusbarRegistry, StatusbarItemDescriptor, StatusbarItemAlignment } from '../../../../platform/statusbar/statusbar';
import { ImageViewStatus } from '../../browser/parts/statusbar/me5ImageViewStatus';
import { me5ExplorerItemContext } from '../../browser/parts/me5Explorer';

StatusbarRegistry.registerStatusbarItem(new StatusbarItemDescriptor(ImageViewStatus, ImageViewStatus.ID, StatusbarItemAlignment.LEFT, me5ExplorerItemContext));
