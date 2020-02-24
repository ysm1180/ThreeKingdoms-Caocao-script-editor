import { decorator } from 'jojo/platform/instantiation/common/instantiation';

export const IPartService = decorator<IPartService>('partService');

export interface IPartService {
  isSidebarVisible(): boolean;

  setSideBarHidden(hidden: boolean): void;
}
