import { decorator } from 'code/platform/instantiation/instantiation';
import { Me5Group, Me5Item } from 'code/editor/workbench/parts/me5ItemModel';

export const IMe5DataService = decorator<Me5DataService>('me5DataService');

export class Me5DataService {
    constructor() {

    }

    public rename(data: Me5Group | Me5Item, name: string) {
        data.setName(name);
    }
}