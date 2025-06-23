import { MasterLocalTree, MasterTree } from '@server/routes/masterTree';

export type MasterLocalTreeType = MasterLocalTree & {
  masterTree?: MasterTree | null;
};

export type MasterTreeType = MasterTree & {
  masterLocalTree?: MasterLocalTreeType[];
};
