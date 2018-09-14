import { decorator } from '../../../../platform/instantiation/instantiation';

export const IPartService = decorator<IPartService>('partService');


export interface IPartService {
	/**
	 * Set sidebar hidden or not
	 */
	setSideBarHidden(hidden: boolean): void;
}
