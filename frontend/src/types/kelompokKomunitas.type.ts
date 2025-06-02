import { KelompokKomunitas } from '@server/routes/kelompokkomunitas';

import { GroupActivityType } from './groupActivity.type';
import { TreeType } from './tree.type';

export type KelompokKomunitasType = KelompokKomunitas & {
  trees?: Partial<TreeType>[];
  groupActivities?: Partial<GroupActivityType>[];
};
