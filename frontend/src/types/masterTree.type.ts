import { MasterLocalTree, MasterTree } from '@server/routes/masterTree';

export type MasterLocalTreeType = MasterLocalTree;

export type MasterTreeType = MasterTree & {
  masterLocalTree?: MasterLocalTreeType[];
};
