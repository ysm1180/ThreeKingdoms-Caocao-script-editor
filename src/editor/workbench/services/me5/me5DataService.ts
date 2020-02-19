import { IInstantiationService } from '../../../../platform/instantiation/instantiationService';
import { Me5File } from '../../../common/me5File';
import { Me5Stat } from '../../parts/files/me5Data';
import { IResourceStat, ResourceDataService } from '../resourceFile/resourceDataService';

export class Me5DataService extends ResourceDataService {
  constructor(
    @IInstantiationService
    private instantiationService: IInstantiationService
  ) {
    super();
  }

  public resolveFile(resource: string) {
    return this.resolve(resource);
  }

  private resolve(resource: string): Promise<IResourceStat> {
    const me5File = new Me5File(resource);

    return me5File
      .open()
      .then((file) => {
        if (!file) {
          throw new Error();
        }
        let baseItemIndex = 1;
        const stat = this.instantiationService.create(Me5Stat, null, true, null, null);
        for (let i = 0, groupCount = me5File.getGroupCount(); i < groupCount; i++) {
          const group = this.instantiationService.create(Me5Stat, me5File.getGroupName(i), true, stat, null);
          group.build(stat);
          for (let j = 0, itemCount = me5File.getGroupItemCount(i); j < itemCount; ++j) {
            const item = this.instantiationService.create(
              Me5Stat,
              me5File.getItemName(i, j),
              false,
              stat,
              baseItemIndex
            );
            item.build(group);
            baseItemIndex++;
          }
        }

        return stat;
      })
      .catch(() => {
        return null;
      });
  }
}
