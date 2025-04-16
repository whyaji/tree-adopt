import { MasterTreeType } from '@/types/masterTree.type';

import { api } from './api';

const masterTreeApi = api['master-tree'];

export async function createMasterTree(masterTree: Omit<MasterTreeType, 'id'>) {
  const res = await masterTreeApi.$post({
    json: masterTree,
  });
  if (!res.ok) throw new Error(res.statusText);
  return res.json();
}

export async function getMasterTrees(search: string, page: number, limit: number) {
  const res = await masterTreeApi.$get({
    query: { search, page, limit },
  });
  if (!res.ok) throw new Error(res.statusText);
  return res.json();
}

export async function getMasterTree(id: string) {
  const res = await masterTreeApi[':id{[0-9]+}'].$get({
    param: { id },
  });
  if (!res.ok) throw new Error(res.statusText);
  return res.json() as Promise<{ data: MasterTreeType }>;
}

export async function updateMasterTree(masterTree: MasterTreeType) {
  const res = await masterTreeApi[':id{[0-9]+}'].$put({
    json: masterTree,
    param: { id: masterTree.id.toString() },
  });
  if (!res.ok) throw new Error(res.statusText);
  return res.json();
}

export async function deleteMasterTree(id: string) {
  const res = await masterTreeApi[':id{[0-9]+}'].$delete({
    param: { id },
  });
  if (!res.ok) throw new Error(res.statusText);
  return res.json();
}
