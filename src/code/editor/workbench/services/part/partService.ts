import { decorator } from '../../../../platform/instantiation/instantiation';

export const IPartService = decorator<IPartService>('partService');

export interface IPartService {
    isSidebarVisible(): boolean;

    setSideBarHidden(hidden: boolean): void;
}
